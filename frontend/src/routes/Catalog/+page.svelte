<script lang="ts">
	
	import { page } from "$app/stores";
	let slug = $page.params.slug;
	import { onMount } from "svelte";

	import { allGoods } from "../GoodCardAdmin/[id]/logic";
	import { loadGoods } from "../GoodCardAdmin/[id]/logic";
	import { goto } from "$app/navigation";
	let balance:number=0;
	onMount(async () => {
		document.body.style.background = "rgba(53, 52, 51, 1)";

		// Загрузка товаров при монтировании компонента
		const goods = await loadGoods();
		allGoods.set(goods);
		balance= await getBalance();
	});
	let search="";
	function profile(){
		window.location.href="/Exict";
	}
	function OpenGood(good: GoodType) {
		goto(`GoodCard/${good.ProductID}`);
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
	let token:string="P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA="

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
			<input class="sInput" placeholder="Найти" bind:value={search} />
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

{#if search.length===0 || $allGoods.filter(good=>good.Name.includes(search)).length>0}
<div class="allGoodsManager">
	<div class="abGoods">
		<div class="txt">Все товары</div>
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
	</div>
	<div class="balans">
		Мой баланс:
		<div class="coloredWord">{balance} коинов</div>
	</div>
</div>
{#if $allGoods.length !== 0}
	<div class="goods">
		{#each filteredGoods as good}
		{#if search.length == 0 || good.Name.includes(search)}
			<div class="good">
				<button class="imag" on:click={()=>{OpenGood(good)}}>
					<img class="image" src={`data:image/jpg;base64,${good.Photo}`} alt="" />
				</button>
				
				<div class="description">
					<div class="priceGood">{good.Price} коинов</div>
					<div class="nameGood">{good.Name}</div>
					
				</div>
			</div>

			
		{/if}
		{/each}
		

	</div>
	
{/if}
{:else}
    <div class="empty">
        <div class="textE">Ничего не нашлось по вашему запросу</div>
        <div class="messageE">Попробуйте поискать по-другому или сократить запрос</div>
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
	.allGoodsManager {
		width:
			Fixed 1,
			342px;
		height: 46px;
		gap: 0px;
		justify-content: space-between;
		opacity: 0px;
		display: flex;
		margin-top: 20px;
		.abGoods {
			width: 709px;
			height: 46px;
			gap: 30px;
			opacity: 0px;
			.txt {
				position: absolute;
				left: 50px;
				width: 215px;
				height: 46px;
				gap: 0px;
				opacity: 0px;
				font-family: Montserrat Alternates;
				font-size: 32px;
				font-weight: 600;
				line-height: 45.83px;
				text-align: left;
				text-underline-position: from-font;
				text-decoration-skip-ink: none;
				color: white;
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
					top: 130px;
					left: 250px;
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
					top: 130px;
					left: 460px;
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
		.balans {
			margin-top:10px;
			width: 278px;
			height: 29px;
			font-family: Montserrat;
			font-size: 24px;
			font-weight: 400;
			line-height: 29.26px;
			text-align: right;
			display: flex;
			color: white;
			position: absolute;
			top: 128px;
			left: 1130px;
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
	.goods {
		position: absolute;
		margin-top:40px;
		top: 196px;
		left: 50px;
		width: 305px;
		height: 433px;
		gap: 25px;
		opacity: 0px;
		display: grid;
		grid-template-columns: repeat(4, 1fr); /* 4 колонки одинаковой ширины */
		.good {
			
			.imag{
				width:0px;
				height:0px;
				background: rgba(53, 52, 51, 1);
				border:none;
				.image {
					
					width: 305px;
					height: 344px;
					
					border-radius: 15px;
					
				}
			}
			
			.description {
				margin-left: 10px;
				margin-top: 10px;
				width: 305px;
				height: 64px;
				gap: 0px;
				opacity: 0px;
				.nameGood {
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
				.priceGood {
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
		}
	}
	.empty {
		position: absolute;
		width: 690px;
		height: 87px;
		top: 145px;
		left: 50px;
		gap: 10px;
		opacity: 0px;
		.textE {
			width: 690px;
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
		.messageE {
			width: 690px;
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
			color: rgba(138, 137, 137, 1);
		}
	}
	footer {
		display: flex;
		position:absolute;
		margin-top: 250px;
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
</style>
