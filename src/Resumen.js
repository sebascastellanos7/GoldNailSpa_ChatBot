import { createBot, createProvider, createFlow, addKeyword, MemoryDB, utils } from '@builderbot/bot'


const SayResume = addKeyword('resumen')
    .addAnswer('Este es el resumen de tu pedido 👇',
        null, async (_, {flowDynamic, state}) => {
            const allStates = state.getMyState();
            await flowDynamic(`*Servicio:* ${allStates.nombre}.\n*Fecha y hora:* ${allStates.fechaYhora}.`)
            }    
        )
    .addAnswer('*Recuerda* que estamos revisando nuestra agenda📒 y pronto nos contactaremos contigo para confirmar la cita📱.')

export default SayResume;