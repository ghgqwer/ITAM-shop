<script lang="ts">
	let token:string="P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA="
	import { onMount } from "svelte";
	onMount(() => {
		document.body.style.background = "rgba(53, 52, 51, 1)";
	});
	function profile(){
		window.location.href="/Exict";
	}
	const goods = [
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "Блокнот для учёбы",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
        {
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "Блокнот для учёбы",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		},
		{
			ExecutorLogin: "Vadim_cvbnqq1",
			ProductID: "4",
			Name: "cool stickers",
			Description: "show everyone",
			Count: 100,
			Price: 10,
			IsUnique: false,
			Category: "stickers"
		}
	];
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
            <a href="/Inventar"><button class="inventar">
				<img src="/inventar.svg" alt="" />
				инвентарь
			</button></a>
			
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
<div class="word">Инвентарь</div>
{#if goods.length !== 0}
	<div class="goods">
		{#each goods as good}
			<div class="good">
				<div class="img">
					<img class="image" src="/image.png" alt="" />
					<img class="got" src="/got1.svg" alt=""/>
				</div>
				
				<div class="description">
					<div class="priceGood">{good.Price} коинов</div>
					<div class="nameGood">{good.Name}</div>
					
				</div>
			</div>
		{/each}
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
	.word {
		position: absolute;
		width: 205px;
		height: 46px;
		top: 120px;
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
	.goods {
		display: flex;
		position: absolute;
		top: 196px;
		left: 50px;
		width: 305px;
		height: 433px;
		gap: 25px;
		opacity: 0px;
		display: grid;
		grid-template-columns: repeat(4, 1fr); /* 4 колонки одинаковой ширины */
		.good {
			.img{
				position:relative;
				.image {
				
				width: 305px;
				height: 344px;
				border-radius: 15px;
				opacity: 1px;
				
			}
			.got{
					position:absolute;
					top:14px;
					left:15px;

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
	footer {
		display: flex;
		margin-top:250px;
		width: 1500px;
		height: 150px;
		position:absolute;
		top:874px;
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
