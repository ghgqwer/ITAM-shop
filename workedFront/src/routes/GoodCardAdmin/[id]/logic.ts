import { writable } from "svelte/store";
export const goods = writable<GoodType[]>([]);
export let allGoods=writable<GoodType[]>([]); 
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
        goods.set(obj);
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
export async function createGood(name:string,category:string, description:string,picture:string,isUnic:boolean,count:number,price:number):Promise<GoodType | null>{
    const id1=self.crypto.randomUUID().trim();
        const newGood={
        Name: name,
        Description: description,
        ProductID: id1,
        Photo: picture,
        Count:count,
        IsUnique: isUnic,
        Category: category,
        Price: price,
        

    };
    try {
        const response = await fetch("http://89.111.154.197:8080/api/admin/storageProduct", {
            method: "POST",
            body: JSON.stringify({
                ProductID: self.crypto.randomUUID().trim(),
                Name: name,
                Description: description,
                Count: Number(count),
                Price: Number(price),
                IsUnique: isUnic,
                Category: category
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.json}`);
        }
    } catch (error) {
        console.log("Ошибка:", error);
    }
    
    

    
        
    //Обновляем хранилище товаров
    goods.update(currentGoods =>{
        const updatedGoods=[...currentGoods,newGood];
        //Cохранить обновлённый массив на сервере
        
        return updatedGoods;

    })
    //возвращаем созданный товар
    return newGood;
}
export async function DeleteGoodById(goodID:string){
    try{
        let promise=await fetch("http://89.111.154.197:8080/api/admin/storageProduct",{
            method:"DELETE",
            body:JSON.stringify({
                "ExecutorLogin": "Vadim_cvbnqq1",
                "ProductID": goodID
            })
        })
        if (!promise.ok) {
            throw new Error(`HTTP error! status: ${promise.status}`);
        }
        goods.update(currentGoods=>{
            const updatedGoods=currentGoods.filter(good=>good.ProductID!=goodID);
            //Cохранить обновлённый массив на сервере
            
            return updatedGoods;
        });
        allGoods.update(currentGoods=>{
            const updatedGoods=currentGoods.filter(good=>good.ProductID!=goodID);
            //Cохранить обновлённый массив на сервере
            
            return updatedGoods;
        });
    } catch(error){
        console.log("Ошибка:",error)
    }
    

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



