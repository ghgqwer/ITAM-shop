<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	async function loadGoodsToBasket(event:Event): Promise<GoodType[]>{
    event.preventDefault();
    try{
		let response = await fetch("http://127.0.0.1:8080/api/checkCart",{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'

    });
	const goods: GoodType[] = await response.json(); // Предполагаем, что ответ - это массив GoodType
    return goods;
	}catch(error){
		console.log("Ошибка:", error);
		return [];
	}
}
    let basketGoods:GoodType[]=[];
	onMount(async() => {
		document.body.style.background = "rgba(53, 52, 51, 1)";
		basketGoods = await loadGoodsToBasket(new Event('load'));
	});
	let amount = 1;
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
	function profile(){
		window.location.href="/Exict";
	}
	function plus(good: GoodType) {
		if (amount < good.Count) {
			amount++;
		}
	}
	function minus(good: GoodType) {
		if (amount > 1) {
			amount--;
		}
	}
	
	function forGoods(){
		goto(`/Catalog`)
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

			<button class="profile" on:click={()=>{profile()}}>
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
		<div class="coloredWord">10 коинов</div>
	</div>
</div>
{#if basketGoods.length>0}
	<div class="goods">
		{#each basketGoods as good}
			<div class="good">
				<img class="image" src="/image.png" alt="" />
				<div class="description">
					<div class="nameGood">{good.Name}</div>
					<div class="left">Осталось {good.Count} шт</div>
				</div>
				<div class="cost">
					<div class="priceGood">{good.Price} коинов</div>
					<div class="changeAmount">
						<button class="minus" on:click={() => minus(good)}>
							<img src="/minus.png" alt="" />
						</button>
						<div class="txtA">{good.Count}</div>
						<button class="plus" on:click={() => plus(good)}>
							<img src="/icon-plus.svg" alt="" />
						</button>
					</div>
				</div>
				<button class="delete">
					<img src="/delete.svg" alt="" />
				</button>
			</div>
		{/each}
	</div>
	<div class="buying">
		<button class="ordering">
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
						<div class="finalGoodsAmount">Товары, 2 шт</div>
						<div class="finalCost">45 коинов</div>
					</div>
					<div class="howMuchPay">
						<div class="txtItog">Итого</div>
						<div class="Pay">
							<div class="digit">30</div>
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
		<button class="Message2" on:click={()=>{forGoods()}}>
			<img src="/forGoods.svg" alt=""/>
		</button>
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
		width: 1600px;
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
            border:0px;

			
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
								margin-top:1px;
                                margin-right:4px;
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
            margin-left:5px;
            margin-top:30px;
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
		width: 1600px;
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
				margin-top:30px;
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
			margin-right:50px;
			display: flex;
			width: 495px;
			height: 59px;
			gap: 30px;
			opacity: 0px;
			.tgtxt {
				
				margin-top:40px;
				width: 20px;
				height: 20px;
				gap: 10px;
				opacity: 0px;
				color:grey;
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
					margin-top:10px;
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
					margin-top:10px;
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
					margin-top:10px;
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
</style>
