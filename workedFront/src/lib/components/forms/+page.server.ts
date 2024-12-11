import { setError,fail, superValidate,message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from "zod";

const colors=['Красный','Чёрный','Белый','Синий'];
	const schema = z.object({
		name: z.string(),
		email: z.string().email(),
        color: z.enum(colors).array().min(1).default([colors[0]])
	});
	export const load = async({params})=>{
         const form= await superValidate(zod(schema));
         
         return {form} 
    }
    export const actions={
        default: async({request})=>{
            const form=await superValidate(request,zod(schema));
            if (form.data.name==""){
                setError(form, "name","Имя не должно быть пустым")
                return fail(400,{form});
            }
            //Только после всех ошибок мы отправляем запрос на бэкенд
            // await fetch()
            return message(form, `Вы выбрали цвета: ${form.data.color}`);
        }
    };