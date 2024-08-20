import { createBot, createProvider, createFlow, addKeyword, MemoryDB, utils } from '@builderbot/bot'
import flowMenu from './app.js'

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
    .addAnswer('Este es el resumen de tu pedido 👇',
        null, async (_, {flowDynamic, state}) => {
            const allStates = state.getMyState();
            await flowDynamic(`*Servicio:* ${allStates.nombre}.\n*Fecha y hora:* ${allStates.fechaYhora}.`)
            }    
        )
    .addAnswer('*Recuerda* que estamos revisando nuestra agenda📒 y pronto nos contactaremos contigo para confirmar la cita📱.')
    .addAnswer(
        [
            'Si deseas volver *🔙 Al Menú Principal* solo escribe el número *0*'
        ],
        {capture:true, delay:1000}, async (ctx, {gotoFlow, fallBack, flowDynamic})  => 
            {
                if (ctx.body == '0') return gotoFlow(flowMenu);
                    else if (ctx.body == '1' || ctx.body == '2' || ctx.body == '00' || ctx.body == '3' || ctx.body == '4' || ctx.body == '5')
                        {
                            await flowDynamic('Al parecer🤔 quieres volver al *menú principal*, para ello debes escribir el número *0*')
                            return fallBack()
                        }
            }
    )

export default AgendarCita;