import { setError,fail, superValidate,message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from "zod";
const schema = z.object({
    password: z.string(),
    email: z.string().email()
});
export const load = async({params,cookies})=>{
     const form= await superValidate(zod(schema));
     const visited=cookies.get('visited');
     cookies.set("visited","true",{path: '/'})
     return {visited: visited || null, // можно вернуть значение visited
        form
}
     
}
export const actions={
    default: async({request,cookies})=>{
        const form=await superValidate(request,zod(schema));
        if (form.data.password==""){
            setError(form, "password","Введите пароль")
            return fail(400,{form});
        }
        cookies.set('jwt', '123', { path: '/' });
        //Только после всех ошибок мы отправляем запрос на бэкенд
        // await fetch()
        
    }
}
