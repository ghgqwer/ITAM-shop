<script lang="ts">
	const knopki = ["1", "2", "3", "C", "4", "5", "6", "+", "7", "8", "9", "-", "0", "*", "/", "="];
	let number1: string = "";
	let number2: string = "";
	let operator: string = "";
	let result: string = "";
	export let screen: string;

	const btnClick = function (knopka: string) {
		console.log(knopka);
		switch (knopka) {
			case "+":
				operator = knopka;
				screen += knopka;
				console.log(screen);
				break;
			case "-":
				operator = knopka;
				screen += knopka;
				break;
			case "*":
				operator = knopka;
				screen += knopka;
				break;
			case "/":
				operator = knopka;
				screen += knopka;
				break;
			case "=":
				screen = result;
				break;
			case "C":
				screen = "";
				number1 = "";
				number2 = "";
				operator = "";
				break;
			default:
				if (operator.length == 0) {
					number1 += knopka;
					screen += knopka;
				} else {
					number2 += knopka;
					screen += knopka;
				}
		}
		switch (operator) {
			case "+":
				result = String(Number(number1) + Number(number2));

				break;

			case "-":
				result = String(Number(number1) - Number(number2));

				break;
			case "*":
				result = String(Number(number1) * Number(number2));

				break;
			case "/":
				result = String(Number(number1) / Number(number2));

				break;

			default:
				break;
		}
	};
	
	let tasks = [{ id: 2, name: "Task1" }, { id: 23, name: "Task3" },{ id: 26, name: "Task6" }];
</script>

<div class="knopki">
	{#each tasks as task}
		
			{task}
		
	{/each}
</div>


