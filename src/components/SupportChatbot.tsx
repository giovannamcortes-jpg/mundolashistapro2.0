import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const SupportChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola bella profesional! 💖 Bienvenida al Soporte 24/7 con Inteligencia Artificial de **Mundo Lashista Pro**. Me puedes consultar sobre:\n\n* **Gestión de Fichas de Lashistas** (edición de perfiles, plan de suscripción).\n* Confección y carga de **contratos o facturas** en el nuevo Gestor de Documentos.\n* Dudas del portal, agendas, reservas de WhatsApp y fidelización.\n\n¿En qué te puedo asesorar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getLocalResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('contrato') || q.includes('documento') || q.includes('subir') || q.includes('gestor') || q.includes('consentimiento')) {
      return `🤖 **[Asistente de Soporte - Gestor de Documentos]**\n\nPara subir un documento o contrato digital de consentimiento, sigue estos pasos sencillos:\n\n1. Ve al panel de **Administrador (Admin)** desde la pestaña de navegación superior.\n2. En la lista de lashistas, verás un botón o bien puedes simplemente hacer **clic sobre la fila o el nombre de cualquier Lashista**.\n3. Al seleccionarla, se desplegará su **Ficha Técnica y Expediente Clínico**.\n4. En la parte derecha de la ficha, verás la sección de **Gestor de Documentos**.\n5. Ahí puedes arrastrar y soltar archivos en formatos **PDF, PNG o JPG** (como contratos de consentimiento, hojas de alergias, o constancias de pago) o hacer clic para buscar el archivo.\n6. El archivo se guardará localmente en el navegador, ¡listo para que lo consultes u descargues cuando desees! 📄✨`;
    }
    
    if (q.includes('lashista') || q.includes('perfil') || q.includes('editar') || q.includes('datos') || q.includes('expediente')) {
      return `🤖 **[Asistente de Soporte - Lashistas]**\n\n¡Editar lashistas y sus expedientes es sumamente rápido!\n\n1. Entra al panel de **Admin**.\n2. Haz clic sobre el nombre de cualquier lashista en la lista.\n3. Se abrirá su **Ficha de Lashista** con toda su información detallada.\n4. Podrás modificar su Especialidad (Clásicas, Lifting, Volumen Ruso, Diseño de Cejas), su Correo Electrónico, Teléfono y Estado de actividad.\n5. En esa misma ficha podrás ver e ingresar al **Gestor de Documentos** exclusivo para esa lashista para subir su contrato o facturas de comisiones.\n6. Presiona **"Guardar Cambios"** al finalizar para persistir la información. 💖`;
    }
    
    if (q.includes('agenda') || q.includes('reservar') || q.includes('whatsapp') || q.includes('cita') || q.includes('whatsapp') || q.includes('agendapro')) {
      return `🤖 **[Asistente de Soporte - Agenda Pro & WhatsApp]**\n\nEl sistema incluye dos simuladores interactivos para probar el flujo de citas completo:\n\n- **Clienta (Agendar Citas)**: Haz clic en la pestaña **"Citas Clienta"** en la parte superior. Las clientas pueden elegir el servicio (Lifting de Pestañas, Cejas HD, Volumen), la fecha y hora, y su Lashista favorita.\n- **Lashista (Mis Citas)**: Haz clic en la pestaña **"Panel Lashista"** para ver la agenda del día desde el celular de la especialista, donde puede marcar citas como completadas.\n- **Simulador de WhatsApp**: En la pestaña **"AgendaPro"**, verás cómo se automatizan los recordatorios, mensajes de bienvenida y promociones por WhatsApp para tus clientas. ¡Esto reduce las inasistencias en un 85%! 📱💇‍♀️`;
    }

    if (q.includes('fideliza') || q.includes('recuperar') || q.includes('fidelización') || q.includes('dormidos') || q.includes('viral')) {
      return `🤖 **[Asistente de Soporte - Fidelización e Invitación Viral]**\n\nEl sistema te permite reactivar clientas de forma súper simple:\n\n1. En la pestaña **"AgendaPro"**, desplázate hacia abajo hasta la sección **Campañas de Fidelización**.\n2. Filtra a tus clientas según los días que llevan sin agendar (30, 60 o 90 días).\n3. Verás la sugerencia de mensaje automatizado de WhatsApp y podrás dar clic a **"Enviar Campaña de WhatsApp"**.\n4. También puedes usar el **Sistema de Recomendación Viral (Referidos)**: Genera enlaces únicos para tus clientas, de forma que cuando recomienden a una amiga, ambas reciben un 15% de descuento en su próximo retoque de pestañas. ¡Es genial para crecer orgánicamente! 📈✨`;
    }
    
    if (q.includes('precio') || q.includes('costo') || q.includes('plan') || q.includes('básico') || q.includes('pro') || q.includes('membresía') || q.includes('trial')) {
      return `🤖 **[Asistente de Soporte - Membresías del Salón]**\n\nMundo Lashista Pro tiene planes flexibles adaptados a tu negocio:\n\n- **Plan Trial (7 días)**: Acceso de prueba gratis para conocer los paneles.\n- **Plan Básico ($29 USD/mes)**: Permite hasta 3 lashistas activas, agenda digital básica, y base de datos con ficha clínica de clientas.\n- **Plan Pro Premium ($49 USD/mes)**: Lashistas ilimitadas, **Gestor de Documentos** para cargar contratos digitales de consentimiento firmados, recordatorios ilimitados automáticos por WhatsApp y sistema viral de recomendación.\n\n*Nota: Puedes cambiar tu plan instantáneamente en el panel de Admin tocando las tarjetas de cambiar plan abajo de la lista de lashistas para simular los límites.* 💎`;
    }
    
    return `🤖 **[Asistente de Soporte - Mundo Lashista Pro]**\n\n¡Hola! He recibido tu consulta sobre la plataforma.\n\nComo estamos operando de forma estática client-side (óptimo para subir a tu hosting de HostGator sin necesidad de tener Node.js), te comento que tienes acceso completo a todas las funciones interactivas locales:\n\n* **Gestor de Documentos**: Sube contratos digitales de consentimiento, hojas de alergias e historial clínico en la ficha técnica de cada Lashista.\n* **Fidelización y WhatsApp**: Envía campañas automáticas de WhatsApp con plantillas interactivas a clientas que no agenda hace 30/60 días.\n* **Portal de Citas**: Simula cómo agenda una clienta y cómo ve su agenda de citas en el celular cada Lashista.\n\n¿Tienes alguna duda de cómo probar subir un contrato, cómo se simula el portal de citas o los precios de los planes? Escríbeme detalladamente un término clave (como **"contrato"**, **"editar"**, **"WhatsApp"** o **"precios"**) y te daré los pasos detallados de inmediato. 💖🌟`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const userMsgId = `msg-user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to history
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        timestamp
      }
    ]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textToSend })
      });

      if (!response.ok) {
        throw new Error('Servidor estático local activo');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: data.text || 'No obtuve una respuesta válida.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.log("Servidor Node ausente. Ejecutando Asistente Local Autónomo:", err);
      
      // Delay response a tiny bit to make it feel natural like a typing bot
      setTimeout(() => {
        const localReply = getLocalResponse(textToSend);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-bot-local-${Date.now()}`,
            sender: 'bot',
            text: localReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
      }, 700);
      return; // Return early since setTimeout will handle the state reset
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  const quickQuestions = [
    '¿Cómo subo un contrato en el Gestor?',
    '¿Cómo editar datos de una Lashista?',
    '¿Cómo simular el portal de Lashista?',
    'Diferencia entre Plan Básico y Pro'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="support-ai-chatbot">
      {/* Pulse icon button when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#1e1313] hover:bg-black text-[#ebd4aa] hover:text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 relative group border border-gold-500/30"
          title="Soporte AI Mundo Lashista 24/7"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          <MessageSquare className="w-6 h-6 animate-bounce" />
          
          {/* Unread indicator tooltip */}
          <div className="absolute right-16 top-2 bg-white text-zinc-800 text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-md border border-zinc-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Charla con Soporte IA 💻✨
          </div>
        </button>
      )}

      {/* Main chat window container */}
      {isOpen && (
        <div className="bg-white text-[#2b1f1f] rounded-3xl shadow-2xl w-[350px] sm:w-[400px] h-[550px] flex flex-col overflow-hidden border border-zinc-200/80 animate-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-[#1e1313] text-white p-4 flex items-center justify-between border-b border-gold-700/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 text-[#ebd4aa] flex items-center justify-center border border-gold-500/20">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  Soporte 24/7 Pro IA
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" title="Soporte Activo" />
                </h3>
                <p className="text-[10px] text-zinc-300">Inteligencia Artificial Gemini</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#fdfaf7] space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#1e1313] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-zinc-800 border border-zinc-100 rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Simplistic formatting support */}
                  {msg.text.split('\n').map((line, i) => {
                    let formattedLine = line;
                    
                    // Simple replacement of Markdown bold values
                    if (formattedLine.includes('**')) {
                      const parts = formattedLine.split('**');
                      return (
                        <p key={i} className="mb-1">
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#a1762d]">{p}</strong> : p)}
                        </p>
                      );
                    }

                    // Bullets itemizer
                    if (formattedLine.startsWith('* ')) {
                      return (
                        <div key={i} className="flex gap-1.5 pl-1.5 py-0.5">
                          <span className="text-[#a1762d]">•</span>
                          <span>{formattedLine.substring(2)}</span>
                        </div>
                      );
                    }

                    return <p key={i} className={i !== 0 ? "mt-1" : ""}>{formattedLine}</p>;
                  })}
                </div>
                <span className="text-[9px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white text-zinc-500 border border-zinc-100 rounded-2xl rounded-bl-none p-3 text-xs shadow-xs flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="italic text-[10px]">Asistente analizando...</span>
                </div>
              </div>
            )}

            {/* Error alerts */}
            {errorMsg && (
              <div className="p-2 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-[10px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100">
            <span className="text-[9px] font-bold text-zinc-400 capitalize block mb-1">Escribe o pregunta rápido:</span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="bg-white hover:bg-gold-50 hover:text-[#a1762d] text-zinc-600 text-[10px] py-1 px-2 rounded-full border border-zinc-200 hover:border-[#ebd4aa] transition-all cursor-pointer truncate max-w-[200px]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-zinc-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe de reservas de Whatsapp, contratos..."
              className="w-full text-xs text-zinc-800 focus:outline-none bg-zinc-50 py-2.5 px-3 rounded-2xl border border-zinc-200 focus:ring-1 focus:ring-gold-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-[#1e1313] hover:bg-black text-[#ebd4aa] disabled:bg-zinc-200 disabled:text-zinc-400 rounded-xl transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
