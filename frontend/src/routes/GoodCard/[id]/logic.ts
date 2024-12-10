import { writable } from "svelte/store";
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
export async function loadGood(id:string){
    try{
     let promise=await fetch(`http://89.111.154.197:8080/api/product/${id}`,
         {
             method: "GET",
             headers:{
                 "Content-Type":"application/json"
                 }
     
         
         }
        )
        const obj = await promise.json();
        return obj;
    } catch(error){
     console.log("Ошибка:", error)
    }
 }
export let allGoods=writable<GoodType[]>([]);
export async function loadGoods(): Promise<GoodType[]>{
    try{
        const response = await fetch('http://89.111.154.197:8080/api/products',{
            method: "GET",
            headers:{
            "Content-Type":"application/json"
            }

        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const obj = await response.json();
        console.log(obj);
        return obj.map((item: any) => { // Здесь мы указываем тип `any` для item или можете использовать `Record<string, any>`
            console.log('Обрабатываем товар:', item);
            return {
                Name: item.Name, // Используйте Name
                Description: item.Description, // Используйте Description
                ProductID: item.ProductID, // Используйте ProductID
                Photo: item.Photo, // Используйте Photo. Вы можете определить свою логику, если это зависит от структуры данных
                Count: item.Count, // Используйте Count
                Price: item.Price, // Используйте Price
                IsUnique: item.IsUnique, // Используйте IsUnique
                Category: item.Category 
            } as GoodType; // Используем приведение типа
        });

    } catch(error){
        console.log("Ошибка:",error);
    }
    return[];
}