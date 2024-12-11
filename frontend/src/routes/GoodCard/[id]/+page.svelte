<script lang="ts">
	import { goto } from "$app/navigation";
	import { loadGood } from "./logic";
	import { onMount } from "svelte";
	let token: string =
		"P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA=";
	onMount(() => {
		document.body.style.background = "rgba(53, 52, 51, 1)";
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
	
	
	
	let good: GoodType | undefined;
	
	export let data;

	onMount(async () => {
		
		good = await loadGood(data.id);
		console.log(good)
		console.log(data)
	});
	async function putInBasket(event:Event){
		event.preventDefault();
		try{
			let response= await fetch("http://89.111.154.197:8080/api/addInCart",{
			method: "POST",
			body:JSON.stringify({
				ProductID: data.id
			}),
			headers: {
                "Content-Type": "application/json",
				"Authorization": token
            },
			credentials: 'include' 
		});
		if (!response.ok) { 
            throw new Error(`Ошибка: ${response.status}`); 
        }

        // Обработка успешного ответа 
        const result = await response.json(); 
        console.log(result); // Используйте для диагностики 
		if (!data.id) { 
    console.log("ID товара отсутствует."); 
    return; 
} 

		} catch(error){
			console.log("Ошибка при добавлении товара:", error)
			console.log("Наше id:",data.id)
		}
	}
	function backToCatalog(){
		goto(`/Catalog`);
	}
	let unic="";
	if(good?.IsUnique){
		unic="единоразовая покупка"
	} else{
		unic="множественная покупка"
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

			<button class="profile" on:click={() => {profile()}}
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
<div class="body">
	<button class="backToMain" on:click={()=>{backToCatalog()}}>
		<img src="/backToMain.svg" alt="" />
	</button>
	<div class="pictures">
		
		<img class="photoes" src={`data:image/jpg;base64,${good?.Photo}`} alt="" />
	</div>
	<div class="information">
		<div class="name">
			{good?.Name}
		</div>
		<div class="coins">
			<div class="NumberCoins">{good?.Price}</div>
			<div class="pictureCoins">
				<img src="/coins.svg" alt="" />
			</div>
		</div>
		<div class="description">
			<div class="WordDescription">Описание</div>
			<div class="textDescription">{good?.Description}</div>
		</div>
		<div class="AmountHaving">
			<div class="grText">
				Количество в наличии.................................................
			</div>
			<div class="numberHaving">{good?.Count}шт.</div>
		</div>
		<div class="isUnic">
			<div class="grTextU">Уникальность...............................</div>
			<div class="Answer">{unic}</div>
		</div>
		<button class="inBasket" on:click={putInBasket}>
			<div class="txtInBasket">В корзину</div>
		</button>
	</div>
	
	
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
				flex: 1; /* Позволяет занять оставшееся пространство */
				height: 52px;
				border-radius: 20px;
				padding: 6px;
				display: flex;
				align-items: center;
				gap: 10px; /* Расстояние между элементами */
				background-color: white;

				.lupa {
					width: 40px;
					height: 40px;
				}
				.sInput {
					width: 100%;
					height: 40px;
					border: none;
					outline: none; /* Убирает обводку при фокусе */
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
					border: 0px;
					color: grey;
					font-family: Montserrat;
					font-weight: 400px;
					font-size: 16px;
					letter-spacing: -2%;
				}
			}
		}
	}

	.body {
		display: flex;

		.backToMain {
			width: 40px;
			height: 40px;
			background-color: rgba(53, 52, 51, 1);
			border: 0px;
			margin-top: 63px;
			margin-left: 50px;
		}
		.pictures {
			width: fixed 460px;
			height: fixed 700px;
			margin-left: 32px;
			margin-top: 63px;

			border-radius: 15px;
			justify-content: space-between;
			padding-bottom: 335px;
			.photoes {
				width: 460px;
				height: 700px;
				border-radius: 15px;
				position: relative;
			}

			.btn {
				background-color: rgba(53, 52, 51, 1);
				border: 0px;
			}
			.back {
				border: 0px;
				width: 30px;
				height: 30px;
				position: absolute;
				top: 489px;
				left: 130px;
				margin-left: 10px;

				transform: translateY(-50%);
				margin-top: 35px;
				z-index: 1;
			}
			.forward {
				transform: rotate(180deg);
				width: 30px;
				height: 30px;
				border: 0px;
				width: 30px;
				height: 30px;
				position: absolute;
				top: 500px;

				border: none;
				padding: 0px;
				z-index: 1;
				margin-top: 10px;
				margin-left: 415px;
			}
		}
		.information {
			font-family: "Montserrat", sans-serif;
			width: fixed 542px;
			height: 550px;
			margin-top: 70px;
			margin-left: 44px;
			display: flex;
			flex-direction: column;
			gap: 50px;

			.isUnic,
			.AmountHaving {
				display: flex;
				justify-content: space-between;
				width: 421px;

				.grTextU,
				.grText {
					font-weight: 400;
					font-size: 16px;
					line-height: 24.82px;
					color: gray;
				}
				.Answer,
				.numberHaving {
					font-weight: 400;
					font-size: 16px;
					line-height: 24.82px;
					color: white;
				}
			}

			.name {
				color: white;
				font-weight: 600;
				font-size: 24px;
				line-height: 34.37px;
			}
			.coins {
				display: flex;
				align-items: center;
				width: 90px;
				height: 50px;
				border-radius: 10px;
				padding-top: 2px;
				padding-right: 30px;
				padding-left: 30px;
				padding-bottom: 2px;

				background: linear-gradient(90deg, #ff8964 0%, #8f7aff 100%);

				.NumberCoins {
					font-family: "Montserrat Alternates", sans-serif;
					font-weight: 600;
					font-size: 32px;
					line-height: 45.83px;
					color: white;
				}
				.pictureCoins {
					width: 35px;
					height: 35px;
					padding-top: 0px;
					padding-left: 15px;
				}
			}
			.description {
				.WordDescription {
					font-weight: 400;
					font-size: 16px;
					line-height: 24.82px;
					color: gray;
				}
				.textDescription {
					color: white;
					font-weight: 400;
					font-size: 16px;
					line-height: 24.82px;
				}
			}
			
		}
		.inBasket {
				width: 303px;
				text-align:center;
				height: 70px;
				margin-top:20px;
				padding: 0px 85px 0px 85px;
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


				.txtInBasket {
					width: 110px;
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
					color: rgba(0, 0, 0, 1);
				}
			}
	}
	footer {
		display: flex;
		position: absolute;
		margin-top: 200px;
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
