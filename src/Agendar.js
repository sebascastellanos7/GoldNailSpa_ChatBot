import { createBot, createProvider, createFlow, addKeyword, MemoryDB, utils } from '@builderbot/bot'

const AgendarCita = addKeyword('1', {sensitive:true})
    .addAnswer(
        [
            'Wow🙌, estoy muy feliz😃! gracias por confiar en nosotros 🙏',
        ]
        )
    .addAnswer(
        [
            '¿Ya Sabes qué hacerte?🤔\n',
            'Por favor escribe el *nombre del servicio o servicios* que deseas realizarte💅.\n',
            '*CUIDADO☢️*\n*(Solo debes enviar un mensaje)*\n',
            '*Por Ejemplo:* Manos semi y pies tradicionales para dos personas\n',
        ],
        {capture:true}, async(ctx, {state}) => {
            const NameService = ctx.body
            await state.update({nombre: NameService})}
        )
    .addAnswer(
        [
            'Ahora escribe la posible *Fecha 📆* y *hora 🕐* de tu servicio.\n',
            '*CUIDADO☢️*\n*(Solo debes enviar un mensaje)*\n',
            '*Por Ejemplo:* Mañana a las 3pm\n',
        ],    
        {capture:true}, async(ctx, {state}) => {
            const DataService = ctx.body
            await state.update({fechaYhora: DataService})}
        )
    .addAnswer('Gracias por confiar en nosotros 😄. Para ver tu pedido escribe la palabra *resumen*')

export default AgendarCita;