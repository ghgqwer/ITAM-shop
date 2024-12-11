<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import {bImg} from "./logic";
	onMount(() => {
		document.body.style.background = "rgba(53, 52, 51, 1)";
	});
	
	import {loadGood } from "./logic";
	export let data;
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


	let good: GoodType | undefined;
	
	if(data.id=="new"){
		good={
			Name: "",
		Description: "",
	    ProductID: "",
		Photo: "",
		Count: 0,
		Price: 0,
		IsUnique: true,
		Category: "",
		}
		console.log("Новый товар:", good)
	} else{
		onMount(async () => {
		good = await loadGood(data.id);

		if (good) {
			nameInput = good.Name;
			descriptionInput = good.Description;
			countInput = good.Count;
			priceInput = good.Price;
			isUnicInput = good.IsUnique;
			categoryInput=good.Category;
			img = good.Photo;
			console.log(good);
		} 
	});
	}
	let img: string = $bImg;
	let nameInput = "";
	let descriptionInput = "";
	let countInput: number = 5;
	let priceInput: number = 10;
	let isUnicInput: boolean = true;
	let categoryInput = "Одежда";
	
	function handlePurchaseTypeChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		isUnicInput = selectElement.value === "multiple";
	}

	
	function profile() {
		window.location.href = "/Exict";
	}
	let token:string="P2LU3FWXFZFT7V2RG6MG6QYJMS6QMM6S3Z6BM32KUSRPLZQOT4LWGQDWBAHZW4KJQ53MSVXN5EQNKQMHBZL6VUG2DD557GLEBACHNHA="
	async function saveGood() {
		if(data.id=="new" && good!=undefined){
			good.Name=nameInput;
			good.Description=descriptionInput;
			good.Count=countInput;
			good.IsUnique=isUnicInput;
			good.Category=categoryInput;
			
			try {
        const response = await fetch("http://89.111.154.197:8080/api/admin/storageProduct", {
            method: "POST",
            body: JSON.stringify({
				ProductID: self.crypto.randomUUID().trim(),
                Name: nameInput,
                Description: descriptionInput,
                Count: Number(countInput),
                Price: Number(priceInput),
                IsUnique: isUnicInput,
                Category: categoryInput,
				Photo: image

            }),
            headers: {
                "Content-Type": "application/json",
				"Authorization": token

            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.json}`);
        }
		goto(`/AdminCatalog`);
    } catch (error) {
        console.log("Ошибка:", error);
    }
		} else if(good){
			const updatedGood = {
				...good,
				id:data.id,
				Name: nameInput,
				Description: descriptionInput,
				Count: countInput,
				Price: priceInput,
				IsUnique: isUnicInput,
				Category: categoryInput,
				Photo: image
			};
						try {
							const response = await fetch("http://89.111.154.197:8080/api/admin/storageProduct", {
								method: "PUT",
								body: JSON.stringify({
									ProductID: updatedGood.id,
						            Name: updatedGood.Name,
						            Description: updatedGood.Description,
						            Count: Number(updatedGood.Count),
						            Price: Number(updatedGood.Price),
						            IsUnique: updatedGood.IsUnique,
									Category:updatedGood.Category,
									Photo: updatedGood.Photo
								}),
								headers: {
                "Content-Type": "application/json",
				"Authorization": token

            }
							});

							if (!response.ok) {
								uploadStatus = "File uploaded successfully!";
							} 
							goto(`/AdminCatalog`)
						} catch (error) {
							console.error("Ошибка при обновлении товара:", error);
						}
					}
				}
	

			

				let fileInput: HTMLInputElement | null;
let selectedFiles: File[] = [];
let uploadStatus: string = "";
let currentImageIndex: number = 0;
let image: string = ""; // Изменяем массив на отдельную строковую переменную

function openFileDialog(): void {
    if (fileInput) {
        fileInput.click();
    }
}

async function handleFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
        // Очищаем предыдущие выбранные файлы
        selectedFiles = [];

        // Проверяем, что выбран только один файл
        if (files.length > 1) {
            uploadStatus = "Пожалуйста, загрузите только одно изображение.";
            return;
        } else {
            selectedFiles.push(files[0]); // Добавляем только один файл
        }

        const file = selectedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            console.log("Добавлено изображение:", base64String);

            image = base64String.split(",")[1]; // Сохраняем изображение в переменной
            currentImageIndex = 0; // Указываем индекс первого изображения (хотя это может быть не нужно)
            uploadStatus = "Изображение загружено."; // Например, вы можете менять статус загрузки
        };
        reader.readAsDataURL(file); // Читаем файл как Data URL
    }
}
function backTM(){
		goto(`/AdminCatalog`)
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

<div class="body">
	<button class="backToMain" on:click={()=>{backTM()}}>
		<img src="/backToMain.svg" alt="" />
	</button>
	
	
	<div class="pictures">
		<button class="newImage" on:click={openFileDialog}>Добавить фото</button>
		<input type="file" bind:this={fileInput} on:change={handleFileChange} class="hidden" multiple style="display:none;" />
	
		{#if image !== ""} <!-- Проверяем, есть ли загруженная картинка -->
			<img class="photoes" src={`data:image/jpg;base64,${image}`} alt="" />
		{:else}
		    <img class="photoes" src={`data:image/jpg;base64,${img}`} alt="" /><!-- Отображаем общее сообщение об отсутствии изображения -->
		{/if}
	</div>
	<div class="information">
		<div class="name">
			<div class="txtN">Название:</div>
			<div class="inputN">
				<input placeholder="Блокнот для учёбы" bind:value={nameInput} />
			</div>
		</div>
		<div class="cost">
			<div class="txtC">Цена:</div>
			<div class="inputC">
				<input placeholder="15 коинов" bind:value={priceInput} />
			</div>
		</div>
		<div class="description">
			<div class="txtD">Описание:</div>
			<div class="inputD">
				<input placeholder="Блокнот формата a5 без клеток" bind:value={descriptionInput} />
			</div>
		</div>
		<div class="amount">
			<div class="txtA">Количество в наличии:</div>
			<div class="inputA">
				<input placeholder="5шт." bind:value={countInput} />
			</div>
		</div>
		<div class="isUnic">
			<div class="txtU">Уникальность:</div>
			<div class="inputU">
				<select on:change={handlePurchaseTypeChange}>
					<option value="single" selected={!isUnicInput}>Единоразовая покупка</option>
					<option value="multiple" selected={isUnicInput}>Множественная покупка</option>
				</select>
			</div>
		</div>
		<div class="category">
			<div class="txtCat">Категория:</div>
			
				<select bind:value={categoryInput}>
					<option value="Одежда">Одежда</option>
					<option value="Аксессуары">Аксессуары</option>
					<option value="Канцелярия">Канцелярия</option>
					<option value="Другое">Другое</option>
					
				</select>
			
		</div>

		<button
			class="saveChanges"
			on:click={() => {
				saveGood();
			}}
		>
			<div class="txtSC">Сохранить изменения</div>
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
		width: 1410px;
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
		
		.btn {
			background-color: rgba(53, 52, 51, 1);
			border: 0px;
		}
		.back {
			border: 0px;
			width: 30px;
			height: 30px;
			position: absolute;
			margin-left: 35px;
			transform: translateY(-50%);
			top: 540px;
			left: 125px;
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

			border: none;
			padding: 0px;
			z-index: 1;
			top: 525px;
			left: 560px;
		}
		.pictures {
			width: 460px;
			height: 700px;
			margin-left: 32px;
			margin-top: 63px;
			position: relative;

			border-radius: 15px;
			justify-content: space-between;
			padding-bottom: 335px;
			.newImage {
			width: 120px;
			height: 25px;
			position: absolute;
			top:10px;
			
			left: 10px;
			gap: 0px;
			border-bottom: 1px;
			opacity: 0px;
			cursor:pointer;
			z-index:100;
			//styleName: body text;
			border: 0px;
			font-family: Montserrat;
			font-size: 16px;
			font-weight: 400;
			line-height: 24.82px;
			text-align: left;
			&:hover {
            background: rgba(255, 255, 255, 1); // Изменяем фон для эффекта наведения
        }

			text-underline-position: from-font;
			text-decoration-skip-ink: none;
		}

			.photoes {
				width: 460px;
				height: 700px;
				border-radius: 15px;
				position: relative;
			}
		}
		.information {
			width: 500px;
			height: 528px;
			margin-top: 62px;
			gap: 50px;
			opacity: 0px;
			padding: 20px;
			display: grid;
			margin-left: 76px;
			text-align: end;
			input {
				border-radius: 10px;
				border: 1px;
				width: 500px;
				height: 40px;
				gap: 28px;
				opacity: 0px;
				padding-left: 10px;
			}

			.name {
				width: 500px;
				height: 65px;
				gap: 0px;
				opacity: 0px;
				.txtN {
					width: 500px;
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
					color: grey;
				}
			}
			.cost {
				width: 500px;
				height: 65px;
				gap: 0px;
				opacity: 0px;
				.txtC {
					width: 500px;
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
					color: grey;
				}
			}
			.description {
				width: 500px;
				height: 66px;
				gap: 0px;
				opacity: 0px;
				.txtD {
					width: 500px;
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
					color: grey;
				}
			}
			.amount {
				width: 500px;
				height: 66px;
				gap: 0px;
				opacity: 0px;
				.txtA {
					width: 500px;
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
					color: grey;
				}
			}
			.isUnic {
				width: 500px;
				height: 66px;
				gap: 0px;
				opacity: 0px;
				.txtU {
					width: 500px;
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
					color: grey;
				}
				select {
					border-radius: 10px;
					border: 1px;
					width: 510px;
					height: 40px;
					gap: 28px;
					opacity: 0px;
					padding-left: 10px;
				}
			}
			.category {
				width: 500px;
				height: 66px;
				gap: 0px;
				opacity: 0px;
				.txtCat {
					width: 500px;
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
					color: grey;
				}
				select {
					border-radius: 10px;
					border: 1px;
					width: 510px;
					height: 40px;
					gap: 28px;
					opacity: 0px;
					padding-left: 10px;
				}
			}
		
		}
		.saveChanges {
			width: 330px;
			height: 71px;
			margin-top: 1px;
			margin-left: 170px;
			padding: 20px 45px 20px 45px;
			gap: 10px;
			border-radius: 20px;
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
			.txtSC {
				margin-left: 15px;
				width: 240px;
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
		width: 1450px;
		height: 150px;
		top: 1100px;
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
