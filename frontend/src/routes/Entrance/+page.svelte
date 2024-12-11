<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	export let data;
	const { form: newForm, message, enhance, errors } = superForm(data.form);
	let token:string="P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA="
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	onMount(() => {
		document.body.style.background = "grey";
	});
	function regist() {
		goto(`/SignIn`);
	}
	async function enter1(){
		try{
			let response= await fetch("http://89.111.154.197:8080/api/login",{
			method:"POST",
			body: JSON.stringify({
				Login: $newForm.email,
				Password: $newForm.password

			}),
			headers:{
            "Content-Type":"application/json",
			"Authorization": token
            }
		});
		if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.json}`);
        }
		goto(`/Catalog`)
		} catch(error){
			console.log("Ошибка при входе:", error)
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

			<button class="profile">
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
<div class="EntrancePanel">
	<div class="EntP1">
		<div class="EntP2">
			<div class="header1">
				<div class="txt">Войдите в аккаунт</div>
				<div class="littleMessage">
					<div class="qe">Нет аккаунта?</div>
					<button
						class="ans"
						on:click={() => {
							regist();
						}}>Регистрация</button
					>
				</div>
			</div>
			<form method="POST" use:enhance>
				<input
					type="email"
					name="email"
					placeholder="Корпоративная почта"
					bind:value={$newForm.email}
					
				/>
				<input
					type="password"
					name="password"
					placeholder="Пароль"
					bind:value={$newForm.password}
				/>
				{#if $errors.email}
					<p>Ошибка в email:{$errors.email}</p>
				{/if}
			</form>
		</div>
		<div class="buttons">
			<button class="Enter" on:click={()=>{enter1()}}>Войти</button>
			<a href="/AdminEntrance"><button class="EnterAsAdmin">Войти как админ</button></a>
		</div>
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
		width: 1600px;
		height: 100px;
		border-bottom: 1px solid;
		padding: 20px 50px;
		gap: 10px;
		background: rgba(53, 52, 51, 1);

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
	.EntrancePanel {
		border-radius: 15px;
		position: absolute;
		display: flex;
		width: 600px;
		height: 366px;
		top: 329px;
		left: 420px;
		padding: 50px 0px 0px 0px;
		gap: 10px;
		opacity: 0px;
		background: rgba(53, 52, 51, 1);

		.EntP1 {
			margin-left: 30px;
			width: 500px;
			height: 266px;
			gap: 50px;
			opacity: 0px;

			.EntP2 {
				width: 500px;
				height: 171px;
				gap: 40px;
				opacity: 0px;

				.header1 {
					width: 500px;
					height: 31px;
					gap: 0px;
					opacity: 0px;

					.txt {
						color: white;
						width: 500px;
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
					}
					.littleMessage {
						display: flex;
						width: 500px;
						height: 19px;
						gap: 5px;
						opacity: 0px;
						padding: 0px;
						.qe {
							width: 89px;
							height: 19px;
							gap: 0px;
							opacity: 0px;
							font-family: Montserrat;
							font-size: 12px;
							font-weight: 400;
							line-height: 18.62px;
							text-align: left;
							text-underline-position: from-font;
							text-decoration-skip-ink: none;
							color: rgba(138, 137, 137, 1);
						}
						.ans {
							border: 0px;
							background: rgba(53, 52, 51, 1);
							margin-left: 0px;
							width: 81px;
							height: 19px;
							gap: 10px;
							opacity: 0px;
							color: white;
						}
					}
				}
				input {
					width: 500px;
					height: 40px;
					gap: 28px;
					opacity: 0px;
					padding: 10px;
					border: 0px;
					border-radius: 15px;
				}
				form {
					line-height: 60px;
					margin-top: 40px;
				}
			}

			.buttons {
				position: absolute;
				top: 270px;
				width: 500px;
				height: 45px;
				gap: 48px;
				opacity: 0px;
				.Enter {
					font-size: 20px;
					border: 0px;
					width: 133px;
					height: 45px;
					padding: 7px 33px 7px 33px;
					gap: 10px;
					border-radius: 15px;
					opacity: 0px;
					background: rgba(255, 255, 255, 1);
					animation-timing-function: ease-out;
					animation-duration: 300ms;
					animation-timing-function: ease-out;
					animation-duration: 300ms;
				}
				.EnterAsAdmin {
					position: absolute;
					top: 10px;
					left: 170px;
					width: 143px;
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
					background-color: rgba(53, 52, 51, 1);
					border: none;
				}
			}
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
