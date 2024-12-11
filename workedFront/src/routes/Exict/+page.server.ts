import { setError,fail, superValidate,message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from "zod";
const schema = z.object({
    password: z.string(),
    email: z.string().email()
});
export const load = async({params})=>{
     const form= await superValidate(zod(schema));
     
     return {form} 
}
export const actions={
    default: async({request})=>{
        const form=await superValidate(request,zod(schema));
        if (form.data.password==""){
            setError(form, "password","Введите пароль")
            return fail(400,{form});
        }
        //Только после всех ошибок мы отправляем запрос на бэкенд
        // await fetch()
        
    }
}