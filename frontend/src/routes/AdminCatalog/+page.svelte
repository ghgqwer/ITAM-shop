<script lang="ts">
	import { page } from "$app/stores";
	let slug = $page.params.slug;
	import { onMount } from "svelte";
	let token: string =
		"P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA=";

	import { allGoods, goods } from "../GoodCardAdmin/[id]/logic";
	import { loadGoods, createGood, DeleteGoodById } from "../GoodCardAdmin/[id]/logic";

	import { goto } from "$app/navigation";

	onMount(async () => {
		document.body.style.background = "rgba(53, 52, 51, 1)";

		// Загрузка товаров при монтировании компонента
		const goods: GoodType[] = await loadGoods();
		allGoods.set(goods); // Обновляем хранилище с загруженными товарами
	});
	function profile() {
		window.location.href = "/Exict";
	}

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
	function OpenGood(good: GoodType) {
		goto(`GoodCardAdmin/${good.ProductID}`);
	}
	async function NewGood() {
		goto(`/GoodCardAdmin/new`);
	}

	let selectedCategory: string = "";
	let selectedSort: string = ""; // Для сортировки: "asc" — сначала дешевле, "desc" — сначала дороже
	let categories = ["Одежда", "Аксессуары", "Канцелярия", "Другое"]; // Пример категорий

	$: filteredGoods = (() => {
		let goodsArray = $allGoods;

		// Фильтрация по категории
		if (selectedCategory) {
			goodsArray = goodsArray.filter(good => good.Category === selectedCategory);
		}

		// Сортировка
		goodsArray.sort((a, b) => {
			return selectedSort === "asc" ? a.Price - b.Price : b.Price - a.Price;
		});

		return goodsArray;
	})();
	
	
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
			<button
				class="profile"
				on:click={() => {
					profile();
				}}
			>
				<img src="/profile.svg" alt="" />
				профиль
			</button>
		</div>
	</div>
</div>
{#if $allGoods.length > 0}
	<div class="heading">
		<div class="headManadge">
			<div class="txt">Все товары</div>
			<div class="managing"></div>
		</div>
		<div class="selectors">
			<div class="priceSelectors">
				<select id="sortSelect" bind:value={selectedSort}>
					<option value="" disabled selected>Сначала дороже</option>
					<!-- Placeholder -->
					<option value="asc">Сначала дешевле</option>
					<option value="desc">Сначала дороже</option>
				</select>
			</div>
			<div class="CategorySelectors">
				<select id="categorySelect" bind:value={selectedCategory}>
					<option value="" disabled selected>Категория</option>
					<!-- Placeholder -->
					<option value="">Все товары</option>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
		</div>

		<button
			class="AddGood"
			on:click={() => {
				NewGood();
			}}
		>
			<img src="/AddGoodButton.svg" alt="" />
		</button>
	</div>
	<div class="body">
		{#each filteredGoods as good}
			<div class="good">
				<img class="image" src={`data:image/jpg;base64,${good.Photo}`} alt="" />
				<div class="description">
					<div class="txtN">
						{good.Name}
					</div>
					<div class="cost">
						{good.Price} коинов
					</div>
				</div>
				<div class="buttons">
					<button
						class="redact"
						on:click={() => {
							OpenGood(good);
						}}>Редактировать</button
					>
					<button
						class="delete"
						on:click={() => {
							DeleteGoodById(good.ProductID);
						}}
					>
						<img src="/deleteB.svg" alt="" />
					</button>
				</div>
			</div>
		{/each}
	</div>
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
{:else}
	<div class="wordAllGoods">Все товары</div>
	<div class="middleBlock">
		<div class="mesB">Ни один товар ещё не был добавлен</div>
		<button
			class="AddGood1"
			on:click={() => {
				NewGood();
			}}
		>
			<img src="/AddGoodButton.svg" alt="" />
		</button>
	</div>
	<div class="footer1">
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
	</div>
{/if}

<style lang="scss">
	.header {
		display: flex;
		width: 1520px;
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
				width: 1, 071px;
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
				.profile {
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
	.heading {
		margin-top: 26px;
		margin-left: 50px;
		display: flex;
		width:
			Fixed 1,
			340px;
		height: 59px;
		gap: 0px;
		justify-content: space-between;
		opacity: 0px;
		.headManadge {
			display: flex;
			width: 693px;
			height: 59px;
			gap: 27px;
			opacity: 0px;
			.txt {
				width: 314px;
				height: 59px;
				gap: 0px;
				opacity: 0px;
				//styleName: h1;
				font-family: Montserrat Alternates;
				font-size: 48px;
				font-weight: 600;
				line-height: 58.51px;
				letter-spacing: -0.02em;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: rgba(255, 255, 255, 1);
			}
		}
		.AddGood {
			margin-left: 500px;
			margin-right:20px;
			width: 240px;
			height: 51px;
			gap: 12px;
			opacity: 0px;
			border: none;
			background: rgba(53, 52, 51, 1);
		}
		.selectors {
			display: flex;
			width: 352px;
			height: 35px;
			gap: 16px;
			opacity: 0px;
			background: rgba(53, 52, 51, 1);
			
			.priceSelectors {
				width: 0px;
				height: 0px;

				gap: 11px;
				border-radius: 10px;

				opacity: 0px;

				select {
					position: absolute;
					top: 140px;
					left: 320px;
					width: 194px;
					height: 35px;
					border-radius: 10px;
					border: 1px solid rgba(255, 255, 255, 1);
					background: rgba(53, 52, 51, 1);
					color: white;
					//styleName: body text;
					font-family: Montserrat;
					font-size: 20px;
					font-weight: 400;
					line-height: 24.82px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					
				}
			}
			.CategorySelectors {
				width: 0px;
				height: 0px;

				gap: 11px;
				border-radius: 10px;
				border: 1px;
				opacity: 0px;

				background: rgba(53, 52, 51, 1);
				select {
					position: absolute;
					top: 140px;
					left: 540px;
					width: 142px;
					height: 35px;
					border-radius: 10px;
					font-family: Montserrat;
					font-size: 20px;
					font-weight: 400;
					line-height: 24.82px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					background: rgba(53, 52, 51, 1);
					color: white;
					border: 1px solid rgba(255, 255, 255, 1);
				}
			}
		}
	}
	.body {
		display: grid;
		margin-top: 40px;
		grid-template-columns: repeat(4, 1fr);
		.good {
			width: Fixed 305px;
			height: 503px;
			gap: 25px;
			opacity: 0px;

			margin-left: 40px;
			.image {
				width: 305px;
				height: 344px;
				gap: 0px;
				border-radius: 15px;
				opacity: 0px;
			}
			.description {
				width: 305px;
				height: 64px;
				gap: 0px;
				opacity: 0px;
				.txtN {
					width: 305px;
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
				.cost {
					width: 305px;
					height: 39px;
					gap: 0px;
					opacity: 0px;
					font-family: Montserrat Alternates;
					font-size: 32px;
					font-weight: 600;
					line-height: 39.01px;
					letter-spacing: -0.02em;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;
					background: linear-gradient(90deg, #ff8964 0%, #8f7aff 100%);
					background-clip: text;
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.buttons {
				display: flex;
				width: 305px;
				height: 45px;
				gap: 1px;
				opacity: 0px;
				.redact {
					width: 228px;
					height: 45px;
					padding: 7px 33px 7px 33px;
					gap: 10px;
					font-size: 20px;
					//styleName: CTA;
					font-family: Montserrat;
					font-size: 20px;
					font-weight: 600;
					line-height: 31.03px;
					text-align: left;
					text-underline-position: from-font;
					text-decoration-skip-ink: none;

					border-radius: 15px;
					opacity: 0px;
					background: rgba(255, 255, 255, 1);
					animation-timing-function: ease-out;
					animation-duration: 300ms;
					animation-timing-function: ease-out;
					animation-duration: 300ms;
				}
				.delete {
					width: 76px;
					height: Fixed45px;
					padding: 0px 23px 0px 23px;
					gap: 10px;
					border-radius: 15px;
					opacity: 0px;
					background: rgba(255, 255, 255, 1);
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
				}
			}
		}
	}
	footer {
		display: flex;
		margin-top: 30px;
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
	.footer1 {
		position: absolute;
		display: flex;
		margin-top: 30px;
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
	.wordAllGoods {
		position: absolute;
		width: 215px;
		height: 46px;
		top: 126px;
		left: 50px;
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
	.middleBlock {
		position: absolute;
		width: 476px;
		height: 125px;
		top: 450px;
		left: 482px;
		gap: 15px;
		opacity: 0px;
		.mesB {
			width: 476px;
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
			color: rgba(138, 137, 137, 1);
		}
		.AddGood1 {
			width: 403px;
			height: 76px;
			background: rgba(53, 52, 51, 1);
			border: 0px;
		}
	}
</style>
