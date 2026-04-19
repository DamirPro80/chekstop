import asyncio
import os
import aiosqlite
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
ADMIN_IDS = list(map(int, os.getenv("ADMIN_IDS", "0").split(",")))
STAFF_IDS = list(map(int, os.getenv("STAFF_IDS", "0").split(",")))

DB_PATH = "chekstop.db"

bot = Bot(token=TELEGRAM_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)


# ─── FSM ──────────────────────────────────────────────
class ClientStates(StatesGroup):
    waiting_for_confirm = State()

class StaffStates(StatesGroup):
    waiting_for_api_key = State()


# ─── Деректер базасы ───────────────────────────────────
async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id   INTEGER NOT NULL,
                client_name TEXT,
                file_id     TEXT NOT NULL,
                status      TEXT DEFAULT 'pending',
                checked_by  INTEGER,
                api_key     TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()


# ─── Көмекші функциялар ────────────────────────────────
def is_staff(user_id: int) -> bool:
    return user_id in STAFF_IDS or user_id in ADMIN_IDS

def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS

def staff_keyboard(payment_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="✅ Растау",       callback_data=f"approve:{payment_id}"),
        InlineKeyboardButton(text="❌ Қабылдамау",  callback_data=f"reject:{payment_id}"),
    ]])

def all_staff() -> list:
    return list(set(STAFF_IDS + ADMIN_IDS))

def client_confirm_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="📤 Жіберу",        callback_data="check:send"),
        InlineKeyboardButton(text="🔄 Қайта жүктеу", callback_data="check:reupload"),
    ]])


# ─── /start ───────────────────────────────────────────
@dp.message(CommandStart())
async def cmd_start(message: Message):
    if is_staff(message.from_user.id):
        role = "Админ" if is_admin(message.from_user.id) else "Қызметкер"
        await message.answer(
            f"Сәлем, {role}! 👋\n\n"
            f"Клиенттердің Kaspi чектері осында келеді.\n"
            f"Статистика үшін: /stats"
        )
    else:
        name = message.from_user.first_name or message.from_user.username or "Клиент"
        await message.answer(
            f"Сәлем, *{name}*! 👋\n\n"
            "Kaspi банкінен алынған төлем чегіңізді "
            "*PDF форматында* жіберіңіз.\n\n"
            "Тексерілгеннен кейін сізге хабарлама жіберіледі.",
            parse_mode="Markdown"
        )


# ─── Дұрыс емес форматтар ─────────────────────────────
@dp.message(F.photo | F.video | F.audio | F.voice | F.sticker)
async def handle_wrong_format(message: Message):
    if is_staff(message.from_user.id):
        return
    await message.answer(
        "⚠️ Қате формат!\n\n"
        "Тек *PDF* форматындағы файл жіберіңіз.\n"
        "Kaspi чегін PDF түрінде сақтап, қайта жіберіңіз.",
        parse_mode="Markdown"
    )


# ─── PDF қабылдау ─────────────────────────────────────
@dp.message(F.document)
async def handle_document(message: Message, state: FSMContext):
    if is_staff(message.from_user.id):
        return

    if message.document.mime_type != "application/pdf":
        await message.answer(
            "⚠️ Қате формат!\n\n"
            "Тек *PDF* форматындағы файл жіберіңіз.\n"
            "Kaspi чегін PDF түрінде сақтап, қайта жіберіңіз.",
            parse_mode="Markdown"
        )
        return

    await state.update_data(file_id=message.document.file_id)
    await state.set_state(ClientStates.waiting_for_confirm)

    await message.answer(
        "📄 Чек жүктелді. Не істегіңіз келеді?",
        reply_markup=client_confirm_keyboard()
    )


# ─── Жіберу / Қайта жүктеу ────────────────────────────
@dp.callback_query(F.data == "check:send", ClientStates.waiting_for_confirm)
async def send_check(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    file_id = data.get("file_id")
    client_name = callback.from_user.full_name

    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT INTO payments (client_id, client_name, file_id) VALUES (?, ?, ?)",
            (callback.from_user.id, client_name, file_id)
        )
        payment_id = cursor.lastrowid
        await db.commit()

    await state.clear()
    await callback.message.edit_text("✅ Чегіңіз жіберілді! Тексерілгеннен кейін хабарлама аласыз.")

    for staff_id in all_staff():
        try:
            await bot.send_document(
                chat_id=staff_id,
                document=file_id,
                caption=(
                    f"📄 Жаңа чек *#{payment_id}*\n"
                    f"👤 Клиент: {client_name}\n"
                    f"🆔 ID: `{callback.from_user.id}`"
                ),
                reply_markup=staff_keyboard(payment_id),
                parse_mode="Markdown"
            )
        except Exception:
            pass

    await callback.answer()


@dp.callback_query(F.data == "check:reupload", ClientStates.waiting_for_confirm)
async def reupload_check(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text(
        "🔄 Файл жойылды.\n\nЖаңа чекті *PDF форматында* жіберіңіз.",
        parse_mode="Markdown"
    )
    await callback.answer()


# ─── Растау ───────────────────────────────────────────
@dp.callback_query(F.data.startswith("approve:"))
async def approve_payment(callback: CallbackQuery, state: FSMContext):
    if not is_staff(callback.from_user.id):
        await callback.answer("Рұқсат жоқ.", show_alert=True)
        return

    payment_id = int(callback.data.split(":")[1])

    async with aiosqlite.connect(DB_PATH) as db:
        rows = await db.execute_fetchall(
            "SELECT status FROM payments WHERE id = ?", (payment_id,)
        )

    if not rows or rows[0][0] != "pending":
        await callback.answer("Бұл чек бұрын өңделген.", show_alert=True)
        return

    await state.update_data(payment_id=payment_id, message_id=callback.message.message_id)
    await state.set_state(StaffStates.waiting_for_api_key)
    await callback.message.answer(f"🔑 Чек *#{payment_id}* үшін API key енгізіңіз:", parse_mode="Markdown")
    await callback.answer()


# ─── API key қабылдау ─────────────────────────────────
@dp.message(StaffStates.waiting_for_api_key)
async def receive_api_key(message: Message, state: FSMContext):
    data = await state.get_data()
    payment_id = data["payment_id"]
    api_key = message.text.strip()

    async with aiosqlite.connect(DB_PATH) as db:
        rows = await db.execute_fetchall(
            "SELECT client_id FROM payments WHERE id = ? AND status = 'pending'", (payment_id,)
        )
        if not rows:
            await message.answer("⚠️ Чек табылмады немесе бұрын өңделген.")
            await state.clear()
            return

        client_id = rows[0][0]
        await db.execute(
            "UPDATE payments SET status='approved', checked_by=?, api_key=? WHERE id=?",
            (message.from_user.id, api_key, payment_id)
        )
        await db.commit()

    # Клиентке 2 хабарлама
    await bot.send_message(
        chat_id=client_id,
        text=(
            "Төлеміңіз расталды! Құттықтаймыз! 🎉\n\n"
            "Қазір сізге API key жіберіледі.\n"
            "Үстінен шерту арқылы көшіріледі."
        )
    )
    await bot.send_message(
        chat_id=client_id,
        text=f"`{api_key}`",
        parse_mode="Markdown"
    )

    await message.answer(f"✅ Чек *#{payment_id}* расталды, клиентке API key жіберілді.", parse_mode="Markdown")
    await state.clear()

    # Басқа қызметкерлерге хабарлау
    for staff_id in all_staff():
        if staff_id != message.from_user.id:
            try:
                await bot.send_message(
                    staff_id,
                    f"ℹ️ Чек *#{payment_id}* — {message.from_user.full_name} растады.",
                    parse_mode="Markdown"
                )
            except Exception:
                pass


# ─── Қабылдамау ──────────────────────────────────────
@dp.callback_query(F.data.startswith("reject:"))
async def reject_payment(callback: CallbackQuery):
    if not is_staff(callback.from_user.id):
        await callback.answer("Рұқсат жоқ.", show_alert=True)
        return

    payment_id = int(callback.data.split(":")[1])

    async with aiosqlite.connect(DB_PATH) as db:
        rows = await db.execute_fetchall(
            "SELECT status, client_id FROM payments WHERE id = ?", (payment_id,)
        )
        if not rows or rows[0][0] != "pending":
            await callback.answer("Бұл чек бұрын өңделген.", show_alert=True)
            return

        client_id = rows[0][1]
        await db.execute(
            "UPDATE payments SET status='rejected', checked_by=? WHERE id=?",
            (callback.from_user.id, payment_id)
        )
        await db.commit()

    await bot.send_message(
        chat_id=client_id,
        text="❌ Өкінішке орай, төлем чегіңіз расталмады.\nҚосымша ақпарат алу үшін қолдау қызметіне хабарласыңыз: @Damir_Imashev"
    )

    try:
        await callback.message.edit_caption(
            caption=callback.message.caption + f"\n\n❌ Қабылданбады — {callback.from_user.full_name}",
            parse_mode="Markdown"
        )
    except Exception:
        pass

    await callback.answer("Қабылданбады.")


# ─── Статистика ───────────────────────────────────────
@dp.message(Command("stats"))
async def cmd_stats(message: Message):
    if not is_admin(message.from_user.id):
        return

    async with aiosqlite.connect(DB_PATH) as db:
        total    = (await db.execute_fetchall("SELECT COUNT(*) FROM payments"))[0][0]
        approved = (await db.execute_fetchall("SELECT COUNT(*) FROM payments WHERE status='approved'"))[0][0]
        rejected = (await db.execute_fetchall("SELECT COUNT(*) FROM payments WHERE status='rejected'"))[0][0]
        pending  = (await db.execute_fetchall("SELECT COUNT(*) FROM payments WHERE status='pending'"))[0][0]

    await message.answer(
        f"📊 *Статистика*\n\n"
        f"📄 Барлық чектер: *{total}*\n"
        f"✅ Расталған: *{approved}*\n"
        f"❌ Қабылданбаған: *{rejected}*\n"
        f"⏳ Күтуде: *{pending}*",
        parse_mode="Markdown"
    )


# ─── Іске қосу ────────────────────────────────────────
async def main():
    await init_db()
    print("ЧекСтоп боты іске қосылды...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
