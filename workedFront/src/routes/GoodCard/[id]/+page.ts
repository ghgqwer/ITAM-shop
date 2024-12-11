export const load=async({ params })=>{
    const id = params.id;
    console.log("Загружается товар с ID:", id);

    return { id };

};