<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import { string } from "zod";
	let quantities = writable<Record<string, number>>({});
	let totalAmount = writable(0);
	let totalCount = writable(0);
	let buyingGoods = writable<BuyType[]>([]);
	let token: string =
		"P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA=";
	async function loadGoodsToBasket(event: Event): Promise<GoodType[]> {
		event.preventDefault();
		try {
			let response = await fetch("http://89.111.154.197:8080/api/checkCart", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: token
				},
				credentials: "include"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const goods: GoodType[] = await response.json(); // Предполагаем, что ответ - это массив GoodType
			console.log("Наши товары:", goods);
			return goods;
		} catch (error) {
			console.log("Ошибка при выводе товаров в корзину:", error);
			return [];
		}
	}
	let basketGoods = writable<GoodType[]>([]);
		let balance:number=0;
	onMount(async () => {
		document.body.style.background = "rgba(53, 52, 51, 1)";
		const goods = await loadGoodsToBasket(new Event("load"));
		basketGoods.set(goods);
		quantities.set(Object.fromEntries(goods.map(good => [good.ProductID, 1])));
		balance= await getBalance();
	});
	function updateTotal() {
		basketGoods.subscribe(goods => {
			const quantityData = $quantities;
			const total = goods.reduce((acc, good) => {
				const quantity = quantityData[good.ProductID] || 1;
				return acc + good.Price * quantity;
			}, 0);
			totalAmount.set(total);
			const count = Object.values(quantityData).reduce((sum, qty) => sum + qty, 0);
			totalCount.set(count);
		})();
	}
	function updateBuyingGoods() {
		basketGoods.subscribe(goods => {
			quantities.subscribe(q => {
				const updatedGoods = goods.map(good => ({
					ProductID: good.ProductID,
					Count: q[good.ProductID] || 1 // Получаем количество из quantities, или 1 по умолчанию
				}));
				buyingGoods.set(updatedGoods);
			});
		})();
	}
	quantities.subscribe(() => {
		updateTotal();
		updateBuyingGoods();
	});
	basketGoods.subscribe(() => {
		updateTotal();
		updateBuyingGoods();
	});
	interface GoodType {
		Name: string;
		Description: string;
		ProductID: string;
		Photo: string;
		Count: number;
		Price: number;
		IsUnique: boolean;
		Category: string;
	}
	function profile() {
		window.location.href = "/Exict";
	}

	function forGoods() {
		goto(`/Catalog`);
	}
	async function deleteGoodFromBasket(good: GoodType) {
		try {
			let response = await fetch("http://89.111.154.197:8080/api/deleteFromCart", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: token
				},
				body: JSON.stringify({
					ProductID: good.ProductID
				})
			});
			basketGoods.update(currentGoods => {
				const updatedGoods = currentGoods.filter(item => item.ProductID !== good.ProductID);
				return updatedGoods; // Возвращаем обновленный массив товаров
			});
			quantities.update(q => {
				const { [good.ProductID]: removed, ...rest } = q;
				return rest; // Удаляем количество товара
			});
		} catch (error) {
			console.log("Ошибка при удалении товара:", error);
		}
	}

	async function updateGoodAmount(productID: string, action: "increase" | "decrease") {
		quantities.update(currentQuantities => {
			const currentAmount = currentQuantities[productID] || 1;

			if (action === "increase") {
				if (currentAmount < 10) {
					// Здесь вы можете установить максимальное количество
					currentQuantities[productID] = currentAmount + 1;
				}
			} else if (action === "decrease") {
				if (currentAmount > 1) {
					currentQuantities[productID] = currentAmount - 1;
				}
			}
			return { ...currentQuantities }; // Возвращаем обновленный объект количества
		});
		try {
			const response = await fetch(
				action === "increase"
					? "http://89.111.154.197:8080/api/increaseProductCart"
					: "http://89.111.154.197:8080/api/decreaseProductCart",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: token
					},
					body: JSON.stringify({ ProductID: productID })
				}
			);
			if (!response.ok) {
				// Если произошла ошибка, можно отменить локальное обновление
				throw new Error(`Ошибка на сервере: ${response.status}`);
			}
		} catch (error) {
			console.log("Ошибка при изменении количества товара на сервере:", error);
			// Возврат к предыдущему количеству, если произошла ошибка на сервере (опционально)
			quantities.update(currentQuantities => {
				const currentAmount = currentQuantities[productID] || 1;
				if (action === "increase") {
					currentQuantities[productID] = currentAmount - 1; // Уменьшаем обратно
				} else if (action === "decrease") {
					currentQuantities[productID] = currentAmount + 1; // Увеличиваем обратно
				}
				return { ...currentQuantities };
			});
		}
	}
	interface BuyType {
		ProductID: string;
		Count: number;
	}
	let showModal = false;
	let showErrorModal = false; // Состояние для модального окна ошибки
    let showConfirmationModal = false; // Состояние для модального окна подтверждения заказа
    let errorMessage = ""

	

    

    async function buyGoods() {
        try {
            let goodsToBuy: BuyType[] = [];
            buyingGoods.subscribe((items) => {
                goodsToBuy = items.map((item: any) => ({
                    ProductID: item.ProductID,
                    Count: Number(item.Count)
                }));
            })();

            console.log("Товары для покупки:", goodsToBuy)

            if (goodsToBuy.length === 0) {
                console.error("Нет товаров для покупки");
                return;
            }

            let response = await fetch("http://89.111.154.197:8080/api/basket/buy", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    Items: goodsToBuy
                })
            });

            if (!response.ok) {
                const errorText = await response.text(); // Читаем текст ошибки
                console.error(`Ошибка на сервере: ${response.status}`, errorText);

                // Если ошибка недостаточно коинов, отображаем соответствующее сообщение
                if (errorText.includes("недостаточно коинов")) { // Замените на вашу проверку
                    errorMessage = "Недостаточно коинов для покупки";
                    showErrorModal = true;
                }
                return;
            } else{
				showModal = true;
			}

            const text = await response.text();
            console.log("Текст ответа от сервера:", text);

            if (text) {
                // Показываем окно подтверждения
                showModal = true;
            } else {
                throw new Error("Ответ сервера пуст");
            }
        } catch (error) {
            console.log("Ошибка при покупке:", error);
        }
    }

    function confirmPurchase() {
        // Здесь вы можете добавить логику для выполнения окончательной покупки, если необходимо

        // После подтверждения показываем окно подтверждения
        
        showModal = true; // Скрываем окно заказа
    }
	function elseMod(){
		showModal=false;
		showConfirmationModal = true;
	}

    // Остальной код без изменений остается


   

    function cancelPurchase() {
        showModal = false; // Закрываем модальное окно заказа
    }

    function closeErrorModal() {
        showErrorModal = false; // Закрываем модальное окно ошибки
    }

    function closeConfirmationModal() {
        showConfirmationModal = false; // Закрываем модальное окно подтверждения
        // Можно добавить логику для перенаправления на каталог
        goto('/Catalog');
    }

	async function getBalance(){
		try{
			let response= await fetch("http://89.111.154.197:8080/api/getBalance/taisiidemidowa@yandex.ru",{
				method:"GET",
				headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }

			});
			const data = await response.json();
			return data;
			
		}catch(error){
			console.log("Ошибка при получении баланса:", error);
			return "";
		}
	}
</script>

<div class="header">
	<div class="headerContainer">
		<div class="itamShop">
			<img src="/itamS.svg" alt="" />
		</div>
		<div class="Search">
			<img class="lupa" src="/lupa.svg" alt="" />
			<input class="sInput" placeholder="Найти" />
		</div>
		<div class="otherButtons">
			<a href="/Inventar"
				><button class="inventar">
					<img src="/inventar.svg" alt="" />
					инвентарь
				</button></a
			>

			<button
				class="profile"
				on:click={() => {
					profile();
				}}
			>
				<img src="/profile.svg" alt="" />
				профиль
			</button>
			<button class="basket">
				<a href="/Basket"><img src="/basket.svg" alt="" /></a>

				корзина
			</button>
		</div>
	</div>
</div>
<div class="headerBasket">
	<div class="txtBasket">Корзина</div>
	<div class="balans">
		Мой баланс:
		<div class="coloredWord">{balance} коинов</div>
	</div>
</div>
{#if $basketGoods.length > 0}
	<div class="goods">
		{#each $basketGoods as good}
			<div class="good">
				<img class="image" src={`data:image/jpg;base64,${good.Photo}`} alt="" />
				<div class="description">
					<div class="nameGood">{good.Name}</div>
					<div class="left">Осталось {good.Count} шт</div>
					<div class="changeAmount">
						<button class="minus" on:click={() => updateGoodAmount(good.ProductID, "decrease")}>
							<img src="/minus.png" alt="" />
						</button>
						<div class="txtA">{$quantities[good.ProductID] || 1}</div>
						<button class="plus" on:click={() => updateGoodAmount(good.ProductID, "increase")}>
							<img src="/icon-plus.svg" alt="" />
						</button>
					</div>
				</div>
				<div class="cost">
					<div class="priceGood">{good.Price} коинов</div>
				</div>
				<button
					class="delete"
					on:click={() => {
						deleteGoodFromBasket(good);
					}}
				>
					<img src="/delete.svg" alt="" />
				</button>
			</div>
		{/each}
	</div>
	<div class="buying">
		<button class="ordering" on:click={buyGoods}>
			<div class="txtO">заказать</div>
		</button>
		<div class="buyingInfo">
			<div class="buyInfo">
				<div class="howToGet">
					<div class="heading">Как получить товар?</div>
					<div class="txtDescription">
						После оформления тебе на почту будет выслан ID заказа. Его можно будет забрать через 2
						дня в ковринге ITAM.
					</div>
				</div>
				<div class="finalInfo">
					<div class="finalGoods">
						<div class="finalGoodsAmount">Товары, {$totalCount} шт</div>
						<div class="finalCost">{$totalAmount} коинов</div>
					</div>
					<div class="howMuchPay">
						<div class="txtItog">Итого</div>
						<div class="Pay">
							<div class="digit">{$totalAmount}</div>
							<img class="img" src="/coins.svg" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="message1">Коины сразу спишутся со счёта после подтверждения заказа.</div>
	</div>
{:else}
	<div class="AboutEmptyMessage">
		<div class="Message1">Твоя корзина пуста.</div>
		<button
			class="Message2"
			on:click={() => {
				forGoods();
			}}
		>
			<img src="/forGoods.svg" alt="" />
		</button>
	</div>
{/if}
{#if showModal}
	<div class="modal">
		<div class="modal-content">
			<div class="specMessage">
				<div class="specQi">Подтверждаете заказ?</div>
				<div class="reminding">Коины сразу спишутся со счёта после подтверждения заказа</div>
			</div>
			<div class="btnM">
			<button class="yes" on:click={elseMod}>Да</button>
			<button class="no" on:click={cancelPurchase}>Отмена</button>
		</div>
		</div>
	</div>
{/if}
{#if showErrorModal}
    <div class="modal">
        <div class="modal-content">
            <div class="specMessage">
                <div class="specQi">Ошибка</div>
				<div class="reminding">Недостаточно коинов для покупки</div>
            </div>
            <div class="btnM">
                <button class="yes" on:click={closeErrorModal}>Ок</button>
            </div>
        </div>
    </div>
{/if}

{#if showConfirmationModal}
    <div class="modal">
        <div class="modal-content">
            <div class="specMessage">
                <div class="specQi">Заказ подтверждён!</div>
				<div class="reminding"> Информация прийдёт вам на почту</div>
            </div>
            <div class="btnM">
                <button class="yes1" on:click={closeConfirmationModal}>В каталог</button>
            </div>
        </div>
    </div>
{/if}


<footer>
	<div class="itamF">
		<img class="imgF" src="/itamF.svg" alt="" />
		<div class="data">2024</div>
	</div>
	<div class="creators">
		<div class="tgtxt">tg:</div>
		<div class="front">
			<div class="frontH">Frontend</div>
			<div class="nikFront">@nomatter714</div>
		</div>
		<div class="backend">
			<div class="backH">Backend</div>
			<div class="nikBack">@cvbnqq</div>
		</div>
		<div class="design">
			<div class="desH">Design</div>
			<div class="nikDes">@takstp</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.header {
		display: flex;
		width: 1500px;
		height: 100px;
		border-bottom: 1px solid;
		padding: 20px 50px;
		gap: 10px;

		.headerContainer {
			width: 1340px;
			height: 60px;
			display: flex;
			gap: 50px;

			.itamShop {
				width: 104px;
				height: 60px;
			}
			.Search {
				flex: 1;
				height: 52px;
				border-radius: 20px;
				padding: 6px;
				display: flex;
				align-items: center;
				gap: 10px;
				background-color: white;

				.lupa {
					width: 40px;
					height: 40px;
				}
				.sInput {
					width: 100%;
					height: 40px;
					border: none;
					outline: none;
				}
			}
			.otherButtons {
				display: flex;
				gap: 20px;
				height: 60px;

				.inventar,
				.profile,
				.basket {
					background: rgba(53, 52, 51, 1);
					width: 87px;
					height: 60px;
					border: 0;
					color: grey;
					font-family: Montserrat;
					font-weight: 400;
					font-size: 16px;
					letter-spacing: -2%;
				}
			}
		}
	}

	.headerBasket {
		width: 1342px; // Исходная ширина
		height: 57px; // Исходная высота
		margin-top: 29px;
		margin-left: 49px;
		justify-content: space-between;
		display: flex;

		.txtBasket {
			width: 148px;
			height: 46px;
			font-family: Montserrat Alternates;
			font-weight: 600;
			font-size: 32px;
			line-height: 45.83px;
			color: white;
		}

		.balans {
			width: 278px;
			height: 29px;
			font-family: Montserrat;
			font-size: 24px;
			font-weight: 400;
			line-height: 29.26px;
			text-align: right;
			display: flex;
			color: white;

			.coloredWord {
				font-family: Montserrat;
				font-size: 24px;
				font-weight: 600;
				background: linear-gradient(89.97deg, #ff8964 57.91%, #8f7aff 99.98%);
				background-clip: text;
				-webkit-background-clip: text;
				color: transparent;
			}
		}
	}

	.AboutEmptyMessage {
		width: 355px;
		height: 127px;
		margin-top: 263px;
		margin-left: 543px;

		.Message1 {
			padding-left: 80px;
			width: 330px;
			padding-bottom: 5px;
			font-family: Montserrat;
			font-size: 25px;
			font-weight: 600;
			line-height: 34.37px;
			color: grey;
		}

		.Message2 {
			background-color: rgba(53, 52, 51, 1);
			border-radius: 15px;
			position: relative; /* Позиционирование для псевдоэлемента */
			padding: 20px; /* Отступ для внутреннего контента */
			z-index: 1;
			border: 0px;
		}
	}
	.goods {
		position: absolute;
		top: 218px;
		left: 50px;

		.good {
			display: flex;
			margin-left: 70px;
			margin-bottom: 40px;
			width: 869px;
			height: 145px;
			gap: 58px;
			opacity: 0px;

			.image {
				width: 145px;
				height: 145px;
				gap: 0px;
				border-radius: 15px;
				opacity: 0px;
			}
			.description {
				width: 248px;
				height: 59px;
				gap: 0px;
				opacity: 0px;

				.nameGood {
					width: 248px;
					height: 34px;
					gap: 0px;
					opacity: 0px;
					//styleName: h3;
					font-family: Montserrat;
					font-size: 24px;
					font-weight: 600;
					line-height: 34.37px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(255, 255, 255, 1);
				}
				.left {
					width: 248px;
					height: 25px;
					gap: 0px;
					opacity: 0px;
					margin-top:30px;
					//styleName: body text;
					font-family: Montserrat;
					font-size: 16px;
					font-weight: 400;
					line-height: 24.82px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(138, 137, 137, 1);
				}
				.changeAmount {
					display: flex;
					margin-top: 10px;
					width: 96px;
					height: 31px;
					padding: 0px 10px 0px 10px;
					gap: 10px;
					border-radius: 10px;
					opacity: 0.7px;
					background-color: rgba(138, 137, 137, 1);
					.minus {
						width: 24px;
						height: 24px;
						gap: 0px;
						opacity: 0px;
						border: none;
						color: white;
						background-color: rgba(138, 137, 137, 1);
					}
					.plus {
						padding-top: 2px;
						padding-left: 2px;
						width: 24px;
						height: 24px;
						gap: 0px;
						opacity: 0px;
						border: none;
						color: white;
						background-color: rgba(138, 137, 137, 1);
					}
					.txtA {
						width: 8px;
						height: 31px;
						gap: 0px;
						opacity: 0px;
						//styleName: CTA;
						font-family: Montserrat;
						font-size: 20px;
						font-weight: 600;
						line-height: 31.03px;
						text-align: left;
						text-underline-position: from-font;
						text-decoration-skip-ink: none;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
			.cost {
				width: 164px;
				height: 90px;
				gap: 13px;
				opacity: 0px;
				.priceGood {
					width: 164px;
					height: 46px;
					gap: 0px;
					opacity: 0px;
					//styleName: h2;
					font-family: Montserrat Alternates;
					font-size: 32px;
					font-weight: 600;
					line-height: 45.83px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					background: linear-gradient(90deg, #ff8964 0%, #8f7aff 100%);
					background-clip: text;
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.delete {
				width: 40px;
				height: 40px;
				padding: 4.38px 5px 4.38px 5px;
				gap: 0px;
				opacity: 0px;
				background-color: rgba(53, 52, 51, 1);
				border: none;
			}
		}
	}
	.buying {
		position: absolute;
		width: Fixed 420px;
		height: 456px;
		top: 218px;
		left: 970px;
		gap: 25px;
		opacity: 0px;
		.ordering {
			width: 420px;
			height: 76px;
			border: none;
			padding: 15px 96px 15px 96px;
			gap: 10px;
			border-radius: 15px;
			opacity: 0px;
			background: rgba(255, 255, 255, 1);
			.txtO {
				width: 173px;
				height: 46px;
				margin-left: 50px;
				gap: 0px;
				opacity: 0px;
				font-family: Montserrat Alternates;
				font-size: 32px;
				font-weight: 600;
				line-height: 45.83px;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: rgba(0, 0, 0, 1);
			}
		}
		.buyingInfo {
			width: 420px;
			height: 280px;
			padding: 13px 0px 0px 0px;
			gap: 43px;
			border-radius: 15px;
			opacity: 0px;
			margin-top: 25px;
			background: rgba(138, 137, 137, 1);
			.buyInfo {
				width: 394px;
				height: 254px;
				gap: 43px;
				opacity: 0px;
				.howToGet {
					width: Fixed 379px;
					height: 106px;
					gap: 0px;
					opacity: 0px;
					margin-left: 15px;
					.heading {
						width: 379px;
						height: 31px;
						gap: 0px;
						opacity: 0px;
						//styleName: CTA;
						font-family: Montserrat;
						font-size: 20px;
						font-weight: 600;
						line-height: 31.03px;
						text-align: left;
						text-underline-position: from-font;
						text-decoration-skip-ink: none;
						color: rgba(255, 255, 255, 1);
					}
					.txtDescription {
						width: 379px;
						height: 75px;
						gap: 0px;
						opacity: 0px;
						//styleName: body text;
						font-family: Montserrat;
						font-size: 16px;
						font-weight: 400;
						line-height: 24.82px;
						text-align: left;
						text-underline-position: from-font;
						text-decoration-skip-ink: none;
						color: rgba(255, 255, 255, 1);
					}
				}
				.finalInfo {
					width: Fixed 394px;
					height: 105px;
					gap: 20px;
					opacity: 0px;
					.finalGoods {
						display: flex;
						margin-top: 30px;
						margin-left: 15px;
						border-bottom: 1px solid;
						border-color: white;
						width: Fill 394px;
						height: 35px;
						gap: 10px;
						opacity: 0px;
						.finalGoodsAmount {
							width: 115px;
							height: 25px;
							gap: 0px;
							opacity: 0px;
							//styleName: body text;
							font-family: Montserrat;
							font-size: 16px;
							font-weight: 400;
							line-height: 24.82px;
							text-align: left;
							text-underline-position: from-font;
							text-decoration-skip-ink: none;
							color: rgba(255, 255, 255, 1);
						}
						.finalCost {
							margin-left: 200px;
							width: 85px;
							height: 25px;
							gap: 0px;
							opacity: 0px;
							//styleName: body text;
							font-family: Montserrat;
							font-size: 16px;
							font-weight: 400;
							line-height: 24.82px;
							text-align: left;
							text-underline-position: from-font;
							text-decoration-skip-ink: none;
							color: rgba(255, 255, 255, 1);
						}
					}
					.howMuchPay {
						margin-top: 30px;
						margin-left: 15px;
						display: flex;
						width: 394px;
						height: 50px;
						gap: 0px;
						justify-content: space-between;
						opacity: 0px;
						.txtItog {
							width: 74px;
							height: 34px;
							gap: 0px;
							opacity: 0px;
							//styleName: h3;
							font-family: Montserrat;
							font-size: 24px;
							font-weight: 600;
							line-height: 34.37px;
							text-align: left;
							text-underline-position: from-font;
							text-decoration-skip-ink: none;
							color: rgba(255, 255, 255, 1);
						}
						.Pay {
							display: flex;
							width: 151px;
							height: 50px;
							padding: 2px 30px 2px 30px;
							gap: 15px;
							border-radius: 10px;
							opacity: 0px;
							background: linear-gradient(90deg, #ff8964 0%, #8f7aff 100%);
							.digit {
								width: 41px;
								height: 46px;
								gap: 0px;
								opacity: 0px;
								//styleName: h2;
								font-family: Montserrat Alternates;
								font-size: 32px;
								font-weight: 600;
								line-height: 45.83px;
								text-align: left;
								text-underline-position: from-font;
								text-decoration-skip-ink: none;
								color: rgba(255, 255, 255, 1);
							}
							.img {
								margin-top: 1px;
								margin-right: 4px;
								width: 37px;
								height: 40px;

								gap: 0px;
								opacity: 0px;
							}
						}
					}
				}
			}
		}
		.message1 {
			margin-left: 5px;
			margin-top: 30px;
			width: 350px;
			height: 50px;
			gap: 0px;
			opacity: 0px;
			//styleName: body text;
			font-family: Montserrat;
			font-size: 16px;
			font-weight: 400;
			line-height: 24.82px;
			text-align: left;
			text-underline-position: from-font;
			text-decoration-skip-ink: none;
			color: rgba(255, 255, 255, 1);
		}
	}
	footer {
		display: flex;
		position: absolute;
		width: 1500px;
		height: 150px;
		top: 874px;
		padding: 25px 50px 25px 50px;
		gap: 0px;
		justify-content: space-between;
		opacity: 0px;
		background: rgba(53, 52, 51, 1);

		.itamF {
			width: Fixed 100px;
			height: 100px;
			gap: 41px;
			opacity: 0px;
			.imgF {
				width: 100px;
				height: 30px;
				gap: 20px;
				opacity: 0px;
			}
			.data {
				margin-top: 30px;
				width: 100px;
				height: 29px;
				gap: 0px;
				opacity: 0px;
				font-family: Montserrat Alternates;
				font-size: 24px;
				font-weight: 300;
				line-height: 29.26px;
				letter-spacing: -0.02em;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: rgba(255, 255, 255, 1);
			}
		}
		.creators {
			margin-right: 50px;
			display: flex;
			width: 495px;
			height: 59px;
			gap: 30px;
			opacity: 0px;
			.tgtxt {
				margin-top: 40px;
				width: 20px;
				height: 20px;
				gap: 10px;
				opacity: 0px;
				color: grey;
			}
			.front {
				width: fixed 173px;
				height: 59px;
				gap: 10px;
				opacity: 0px;
				.frontH {
					width: 173px;
					height: 20px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 16px;
					font-weight: 400;
					line-height: 19.5px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(138, 137, 137, 1);
				}
				.nikFront {
					margin-top: 10px;
					width: 173px;
					height: 29px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 24px;
					font-weight: 400;
					line-height: 29.26px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(255, 255, 255, 1);
				}
			}
			.backend {
				width: Fixed 114px;
				height: 59px;
				gap: 10px;
				opacity: 0px;
				.backH {
					width: 114px;
					height: 20px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 16px;
					font-weight: 400;
					line-height: 19.5px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(138, 137, 137, 1);
				}
				.nikBack {
					margin-top: 10px;
					width: 114px;
					height: 29px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 24px;
					font-weight: 400;
					line-height: 29.26px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(255, 255, 255, 1);
				}
			}
			.design {
				width: 98px;
				height: 59px;
				gap: 10px;
				opacity: 0px;
				.desH {
					width: 56px;
					height: 20px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 16px;
					font-weight: 400;
					line-height: 19.5px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					font-family: Montserrat;
					color: rgba(138, 137, 137, 1);
				}
				.nikDes {
					margin-top: 10px;
					width: 98px;
					height: 29px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat;
					font-size: 24px;
					font-weight: 400;
					line-height: 29.26px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					color: rgba(255, 255, 255, 1);
				}
			}
		}
	}
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;

		
		
	}

	.modal-content {
		background: white;
		font-size: Monsterrat;
		padding: 20px;
		padding-top:40px;
		padding-left:30px;
		border-radius: 20px;
		text-align: center;
		width: 514px;
		height: 240px;
		gap: 35px;
		opacity: 0px;
		.specMessage {
			width: 514px;
			height: 59px;
			gap: 3px;
			opacity: 0px;
			.specQi {
				width: 245px;
				height: 31px;
				gap: 0px;
				opacity: 0px;
				//styleName: CTA;
				font-family: Montserrat;
				font-size: 20px;
				font-weight: 600;
				line-height: 31.03px;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: black;
			}
			.reminding {
				width: 514px;
				height: 25px;
				gap: 0px;
				opacity: 0px;
				//styleName: body text;
				font-family: Montserrat;
				font-size: 16px;
				font-weight: 400;
				line-height: 24.82px;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: rgba(53, 52, 51, 1);
			}
		}
	}

	.btnM {
		margin-top: 40px;
		text-align:left;
		margin-bottom:20px;

		width: 263px;
		height: 45px;
		gap: 20px;
		opacity: 0px;
		.yes {
			width: 95px;
			height: 45px;
			padding: 7px 33px 7px 33px;
			gap: 10px;
			font-size:20px;
			border-radius: 15px;
			opacity: 0px;
			background: rgba(30, 29, 28, 1);
			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;

			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;
			color: white;
		}
		.no {
			position:absolute;
			left:650px;
			font-size:20px;
			font-weight:20px;
			width: 148px;
			height: 45px;
			gap: 0px;
			opacity: 0px;
			width: 148px;
			height: 45px;
			padding: 7px 33px 7px 33px;
			gap: 10px;
			border-radius: 15px;
			border: 1px 0px 0px 0px;
			opacity: 0px;
			border: 1px solid rgba(53, 52, 51, 1);
			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;

			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;
			background-color:white;
		}
	}
	.yes1{
		width: 200px;
			height: 45px;
			padding: 7px 33px 7px 33px;
			gap: 10px;
			font-size:20px;
			border-radius: 15px;
			opacity: 0px;
			background: rgba(30, 29, 28, 1);
			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;

			// On drag
			// Navigate to: "None";
			// Animate: Smart animate;
			animation-timing-function: ease-out;
			animation-duration: 300ms;
			color: white;
	}
</style>
