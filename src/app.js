import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, MemoryDB, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import AgendarCita from './Agendar.js';

const PORT = process.env.PORT ?? 3008


// ***************************** DECLARANDO FUJOS HIJOS DE LOS FLUJOS HIJOS ********************************** //

// *********************** AGENDAR CITA DESDE INFO ****************************//

const AccionNoAgen = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Es una lastima que no agendes con nosotros😔.\n',
            'Pero aquí estaremos para ayudarte en una próxima ocasión.\n',
            'Si deseas volver *🔙 Al Menú Principal* solo escribe el número *0*'
        ],
        {capture:true, delay:500}, async (ctx, {flowDynamic, fallBack, gotoFlow})  => 
            {
                if (ctx.body == '0') return gotoFlow(flowMenu);
                else if (ctx.body == '1' || ctx.body == '2' || ctx.body == '00' || ctx.body == '3' || ctx.body == '4' || ctx.body == '5')
                    {
                        await flowDynamic('Al parecer🤔 quieres volver al *menú principal*, para ello debes escribir el número *0*')
                        return fallBack()
                    }
            })
    
    

// **** FLUJOS HIJOS HIJOS PARA LA PROMO DEL MES ****//

const AccionSi = addKeyword('1', {sensitive:true})
    .addAnswer(
        [
            'Tomaste una gran decisión😃, te felicito!🎉\n',
        ]
    )
    .addAnswer(
        [
            'Ahora escribe la posible *Fecha 📆* y *hora 🕐* de tu servicio.\n',
            '*CUIDADO☢️*\n*(Solo debes enviar un mensaje)*\n',
            '*Por Ejemplo:* Mañana a las 3pm\n',
        ],
        {capture:true}, async(ctx, {flowDynamic}) => {
            const PromoDate = ctx.body
            await flowDynamic(`Este es el resumen de tu pedido: 👇\n*Servicio:* PROMO MES\n*Fecha y hora:* ${PromoDate}`)
        } 
    )
    

const AccionNo = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Lamentamos que no tomes esta increible promoción🥺, quizas en otro momento.\n',
            'Si deseas volver *🔙 Al Menú Principal* solo escribe el número *0*'
        ],
        {capture:true, delay:500}, async (ctx, {gotoFlow})  => 
            {
                if (ctx.body == '0') return gotoFlow(flowMenu);
                else if (ctx.body == '1' || ctx.body == '2' || ctx.body == '00' || ctx.body == '3' || ctx.body == '4' || ctx.body == '5')
                    {
                        await flowDynamic('Al parecer🤔 quieres volver al *menú principal*, para ello debes escribir el número *0*')
                        return fallBack()
                    }
            }
    )

//********************************************


//************************** FLUJOS HIJOS HIJOS PARA CANCELAR O REAGENDAR CITA ***********************/

const AccionReagendar = addKeyword('1', {sensitive:true})
.addAnswer(
    [
        'Muchas gracias por avisarnos 🙏. Y volver a contar con nosotros🤗.\nDebes de seguir solo 1 paso👣 muy sencillo\n',
        '*Paso 1:* escribe el nuevo servicio *(si lo vas a cambiar)* junto con la nueva *fecha📆* y *hora🕐* en que deseas ser reagendad@.\n',
        '*CUIDADO☢️*\n*(Solo debes enviar un mensaje)*\n',
        '*Por Ejemplo:* Manos semi y pies tradicionales para mañana a las 5pm\n',
    ],
    {capture:true, delay:500}, async (ctx, {flowDynamic})  => 
        {
            const Rebooked = ctx.body
            await flowDynamic(`*Este es el resumen de tu pedido* 👇\n${Rebooked}`)
        })
.addAnswer('*Recuerda* que estamos revisando nuestra agenda📒 y pronto nos contacteremos contigo para confirmar la cita📱.')


const AccionCancelar = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Muchas gracias por avisarnos 🙏. Es muy importante ya que podremos agendar otras citas.\n',
            'Por favor escribe el servicio que te *ibas* a realizar, fecha📆 y hora🕐 en que estabas agendad@.\n',
            '*CUIDADO☢️*\n*(Solo debes enviar un mensaje)*\n',
            '*Por Ejemplo:* Mi servicio era de manos semi hoy a las 3pm\n',
            'Por otro lado, si deseas volver *🔙 Al Menú Principal* solo escribe el número *0*'
        ],
        {capture:true, delay:500}, async (ctx, {gotoFlow, flowDynamic})  => 
            {
                const CancelBook = ctx.body
                if (CancelBook == '0') return gotoFlow(flowMenu);
                else{
                    await flowDynamic(`*La siguiente cita ha sido cancelada:* 👇\n${CancelBook}`)
                }              
            }
    )

//***************************************************************************************************

//******************************************************************************************************************



// ********************************************* DECLARANDO FLUJOS HIJOS ***************************************** //



// ******************* FLUJO INFO DE LOS SERVICIOS (2)*********************//
const InfoServicios = addKeyword('2', {sensitive:true})
    .addAnswer(
        [
            'Mira nuestra carta de servicios📄.'
        ]
    )
    .addAnswer('Carta De Servicios Gold Nails Spa', {
        media: '/home/sebascastellanos7/GoldNailSpa_ChatBot/Carta.pdf'
    }
    )
    .addAnswer(
        [
            '¿Deseas hacerte algún servicio?🤔.\n',
            'Escribe el *número* que corresponda👇.\n',
            '*1.* Si\n',
            '*2.* No\n',
            '*0.**🔙 Menú Principal*.\n',
        ],
        {capture:true, delay:500}, async (ctx, {flowDynamic, fallBack, gotoFlow})  => 
        {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    await flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') return gotoFlow(flowMenu);
        }
        
        , [AgendarCita,AccionNoAgen]
        )

//*************************************************************************

// ********************* FLUJO PROMOCION DEL MES (3)********************* //



const PromoMes = addKeyword('3', {sensitive:true})
    .addAnswer(
        [
            'Por este mes de *AGOSTO*🪁 nuestra promo será la siguiente:\n',
            'Si agendas con anticipacion el servicio de *PRESS 0N* tendrás un bono de *10mil* pesos😱😱\n',
            '¿Qué deseas?🤔 Escribe el *número* que corresponda👇.\n',
            '*1.* ✅ Aceptar la Promo.\n',
            '*2.* ❌ Ignorar la Promo.\n',
            '*0.**🔙 Menú Principal*.\n',
        ],
        {capture:true}, async (ctx, {flowDynamic, fallBack, gotoFlow})  => {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    await flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') return gotoFlow(flowMenu);
            }
        
        , [AccionSi,AccionNo]
    )
//*************************************************************************


// ***************** FLUJO CANCELAR O REAGENDAR CITA (4)*******************//
const CancelarCita_Reagendar = addKeyword('4', {sensitive:true})
    .addAnswer(
        [
            'Dejame saber si deseas cancelar la cita o reagendarla. *Escribe el numero que corresponde👇:*\n',
            '*1.* 📅 Reagendar mi cita.\n',
            '*2.* ❌ Cancelar mi cita.\n',
            '*0.**🔙 Menú Principal*.\n',

        ],
        {capture:true, delay:500}, async (ctx, {flowDynamic, fallBack, gotoFlow})  => {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '0')
                {
                    await flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
            else if (ctx.body == '0') return gotoFlow(flowMenu);
            }
        ,[AccionReagendar,AccionCancelar]
    )
//**************************************************************************


// ****************** FLUJO SERVICIO AL CLIENTE (5)************************* //
const ServicioCliente = addKeyword('5', {sensitive:true})
    .addAnswer(
        [
            'Muchas gracias por comunicarte con servicio al cliente, mi nombre es *Alejandra💁‍♀️*, ¿En qué te puedo ayudar?',
            '\n',
            'Si deseas volver *🔙 Al Menú Principal* solo escribe el número *0*, de lo contrario deja tu duda aqui abajo👇'
        ],
        {capture:true, delay:500}, async (ctx, {gotoFlow})  => 
            {
                if (ctx.body == '0') return gotoFlow(flowMenu);

            }
    )

//*************************************************************************




// ******************************** FLOW MENU ESPACIAL PARA RETORNAR AL MENU PRINCIPAL************************************* //

const flowMenu = addKeyword('9991', {sensitive:true}) 
    .addAnswer(
        [
            'Si te interesa alguna de estas opciones por favor *escribe el número* que corresponde👇:\n',
            '*1.* 📅 Para Agendar una cita con nosotros\n',
            '*2.* ❓ Para recibir información sobre nuestro servicios y precios\n',
            '*3.* 🤑 Para ver la *PROMO* del mes\n',
            '*4.* ❌📅 Para Cancelar o Reagendar una cita\n',
            '*5.* 📱 Para hablar con una persona\n',
        ],
        {capture:true, delay:500}, async (ctx, {flowDynamic, fallBack})  => 
        {
            if (ctx.body != '1' && ctx.body != '2' && ctx.body != '3' && ctx.body != '4' && ctx.body != '5')
                {
                    await flowDynamic('*❌Por favor ingresa una opción valida❌*')
                    return fallBack()
                }
        }
        , [AgendarCita,InfoServicios,PromoMes,CancelarCita_Reagendar,ServicioCliente]
        )
export default flowMenu;
//**********************************************************************************************************************


//********************************* FLOW PRIMER SALUDO CON MENU *****************************************/ 

const flowStart = addKeyword(['hola','ola','ole','oli','buenas tardes','buenas','buenos dias','buenas quiero una cita',
    'para agendar una cita','por favor una cita', 'tienes cupo', 'una cita', 'para un cupo'])
    .addAnswer(
        [
            '🙌 Hola bienvenid@, Soy la *IA*🤖 de *Gold Nails Spa*💅 y fui creada para ayudarte',
        ],
        null, async (ctx, {gotoFlow})  => {
            return gotoFlow(flowMenu)
        })

//*******************************************************************************************************



//*********************** FLUJO ALGUIEN DA LAS GRACIAS *******************************/

const flujoThanks = addKeyword(['gracias', 'muchas gracias', 'mil gracias'])
    .addAnswer('Gracias a ti. Es un placer poder ayudarte🤗 y recuerda que en *Gold Nails Spa* siempre estamos para servirte🤗')


// ***************************************** MAIN *************************************//


const main = async () => {
    const adapterFlow = createFlow([flowStart, flujoThanks, flowMenu])
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    httpServer(+PORT)
}

main()
