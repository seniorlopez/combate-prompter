export const scriptData = {
    title: "S11E03 - Venustiano Carranza",
    segments: [
        {
            id: "seg1",
            title: "SEG 1 - EL ORIGEN DEL PRIMER JEFE",
            blocks: [
                {
                    type: "narrator",
                    title: "BLOQUE 1: ¿QUIÉN ES ESTE SEÑOR? (EL LOOK Y EL MITO)",
                    text: "Arranca describiendo al personaje. No es el típico general revolucionario lleno de cananas. Medía 1.90 m, complexión robusta, barba blanca 'florida' estilo patriarca bíblico."
                },
                {
                    type: "narrator",
                    title: "El Mito de los Lentes",
                    text: "Aquí rompes el primer mito. Siempre lo vemos con lentes oscuros. No eran por 'estilo'. Tenía fotofobia. Los usaba para ver de lejos; para leer se los quitaba."
                },
                {
                    type: "narrator",
                    title: "Contexto",
                    text: "Javier Garciadiego lo llama 'El único Don de la Revolución'. Era el adulto en el cuarto lleno de jóvenes armados."
                },
                {
                    type: "narrator",
                    title: "BLOQUE 2: CUATRO CIÉNEGAS",
                    text: "Nació el 29 de diciembre de 1859. Tierra de frontera, peleando contra apaches. Su padre era juarista de hueso colorado."
                },
                {
                    type: "narrator",
                    title: "BLOQUE 4: EL PRIMER LEVANTAMIENTO",
                    text: "Carranza se levantó en armas en 1893 contra Garza Galán. ¡17 años antes que Madero!"
                }
            ]
        },
        {
            id: "seg2",
            title: "SEG 2 - DE REYISTA A REVOLUCIONARIO (1909-1911)",
            blocks: [
                {
                    type: "narrator",
                    title: "BLOQUE 1: LA DECEPCIÓN DE REYES",
                    text: "Carranza apoyaba a Bernardo Reyes. Díaz exilió a Reyes en 1909. Carranza se quedó 'huérfano' políticamente."
                },
                {
                    type: "narrator",
                    title: "Alianza con Madero",
                    text: "Se une a Madero tras el fraude en Coahuila. Una alianza fría: Madero necesitaba experiencia, Carranza un líder."
                },
                {
                    type: "narrator",
                    title: "BLOQUE 2: LA ORGANIZACIÓN BÉLICA",
                    text: "Carranza no estuvo en la trinchera. Organizó logística desde San Antonio, Texas."
                },
                {
                    type: "cue",
                    text: "Ahora hablemos del desastre militar de Madero...",
                    context: "Intro a la Batalla de Casas Grandes",
                    insertionRef: "ficha_casas_grandes"
                },
                {
                    type: "narrator",
                    title: "Encuentro con Villa",
                    text: "Se conocen en la Hacienda de Bustillos. Choque generacional brutal: Carranza (51) vs Villa (32)."
                },
                {
                    type: "cue",
                    text: "Pero la verdadera acción ocurrió en la frontera...",
                    context: "Intro a la Toma de Ciudad Juárez",
                    insertionRef: "ficha_juarez"
                },
                {
                    type: "narrator",
                    title: "BLOQUE 3: LA PROFECÍA",
                    text: "Mayo 1911. Tratados de Ciudad Juárez. Carranza le grita a Madero: 'Revolución que transa, es revolución perdida'."
                }
            ],
            insertions: {
                "ficha_casas_grandes": {
                    title: "FICHA: BATALLA DE CASAS GRANDES",
                    content: "6 de marzo de 1911. Madero atacó con 800 hombres. ¡Desastre total! Perdió y fue herido en el brazo. Carranza dijo: 'Zapatero a tus zapatos'."
                },
                "ficha_juarez": {
                    title: "FICHA: TOMA DE CIUDAD JUÁREZ",
                    content: "8-10 mayo 1911. Villa y Orozco atacaron desobedeciendo a Madero. Usaron la técnica de 'romper paredes' con dinamita. La gente de El Paso veía la batalla desde las azoteas."
                }
            }
        }
    ]
};
