import os
import requests
from aiogram import Bot, types, Dispatcher
from aiogram.dispatcher import Dispatcher, FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.utils import executor
from aiogram.dispatcher.filters import Text
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.contrib.fsm_storage.memory import MemoryStorage

API_TOKEN = ''
API_URL = ''

bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# Определение состояний
class FSMadd_coins(StatesGroup):
    EnterUserLogin = State()
    EnterCoins = State()
    AddCoins = State()

ID = None

async def is_admin(user_id: int, chat_id: int) -> bool:
    member = await bot.get_chat_member(chat_id, user_id)
    return member.status in ("administrator", "creator")

@dp.message_handler(commands=['start', 'help'])
async def commands_start(message: types.Message):
    if not await is_admin(message.from_user.id, message.chat.id):
        await message.reply("You do not have permission to use this command.")
        return
    global ID
    ID = message.from_user.id
    await bot.send_message(message.from_user.id, "Welcome! Use /addcoins to add coins.")

@dp.message_handler(commands=['addcoins'])
async def get_user_log(message: types.Message):
    if message.from_user.id != ID:
        await message.reply("You do not have permission to use this command.")
        return
    await message.reply("Enter user login:")
    await FSMadd_coins.EnterUserLogin.set()  

@dp.message_handler(state=FSMadd_coins.EnterUserLogin)
async def process_user_login(message: types.Message, state: FSMContext):
    if message.from_user.id != ID:
        await message.reply("You do not have permission to use this command.")
        return
    
    user_login = message.text  
    await state.update_data(user_login=user_login)  
    await message.reply(f'You entered login: {user_login}. How much coins do you want to add?')  # Подтверждение введенного логина
    await FSMadd_coins.EnterCoins.set()

@dp.message_handler(state=FSMadd_coins.EnterCoins)
async def process_coins_enter(message: types.Message, state: FSMContext):
    if message.from_user.id != ID:
        await message.reply("You do not have permission to use this command.")
        return
    msg = message.text
    try:
        coins = int(msg)
    except ValueError:
        await message.reply("Coins can be a number only")
        return
    await state.update_data(coins=coins)
    await message.reply(f'You want to add {coins} coins. Now, use /confirm to add coins.')  
    await FSMadd_coins.AddCoins.set()

@dp.message_handler(state=FSMadd_coins.AddCoins)
async def add_coins(message: types.Message, state: FSMContext):
    if message.from_user.id != ID:
        await message.reply("You do not have permission to use this command.")
        return
    
    msg = message.text
    if (msg != "/confirm"):
        await bot.send_message(message.from_user.id, "Failed to add coins.")
        await state.finish() 
    else:
        user_data = await state.get_data()  
        user_login = user_data.get('user_login') 
        coins = user_data.get('coins') 
        print(user_login)
        data = {
            "UserLogin": str(user_login),
            "Coins": int(coins),  
        }

        headers = {
            "Authorization": "P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA=",  # Замените на ваш токен
            "Content-Type": "application/json"  # Убедитесь, что тип контента корректный
        }

        response = requests.put(API_URL, json=data, headers=headers)

        if response.status_code == 200:
            await bot.send_message(message.from_user.id, "Successfully added coins!")
        else:
            await bot.send_message(message.from_user.id, "Failed to add coins.")
        await state.finish()


class FSMBalance(StatesGroup):
    EnterUserLogin = State()
@dp.message_handler(commands=['getbalance'])
async def get_balance(message: types.Message):    
    await message.reply("Enter user login:")
    await FSMBalance.EnterUserLogin.set()  

@dp.message_handler(state=FSMBalance.EnterUserLogin)
async def process_user_login_for_balance(message: types.Message, state: FSMContext):
    user_login = message.text

    response = requests.get(f"http://89.111.154.197:8080/api/getBalance/{user_login}")

    if response.status_code == 200:
        balance = response.text  
        await message.reply(f'User login: {user_login}, Balance: {balance}')
    else:
        await message.reply("Failed to retrieve balance.")

    await state.finish() 

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
