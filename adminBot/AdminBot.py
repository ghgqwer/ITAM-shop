import os
import requests
from aiogram import Bot, types, Dispatcher
from aiogram.dispatcher import Dispatcher, FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.utils import executor
from aiogram.dispatcher.filters import Text
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.contrib.fsm_storage.memory import MemoryStorage

API_TOKEN = '7309994657:AAGDVcEVOQCdzh3ni1l78EROHk5n74r59-s'
API_URL = 'http://89.111.154.197:8080/api/admin/addCoins'

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
    if msg.isdigit() == False:
        await message.reply("coins can be number only")
        return
    coins = int(msg)
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

        response = requests.put(API_URL, json=data)

        if response.status_code == 200:
            await bot.send_message(message.from_user.id, "Successfully added coins!")
        else:
            await bot.send_message(message.from_user.id, "Failed to add coins.")
        await state.finish()

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)