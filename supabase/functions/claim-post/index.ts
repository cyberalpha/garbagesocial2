
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no está configurado");
    }

    // Crear cliente de Supabase con la clave de servicio (permite bypass de RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return new Response(
        JSON.stringify({ error: "Se requieren postId y userId" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Verificar que la publicación existe y está disponible
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .eq("status", "available")
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ 
          error: "La publicación no existe o no está disponible",
          details: postError?.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Actualizar la publicación como reclamada
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        status: "claimed",
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", postId);

    if (updateError) {
      return new Response(
        JSON.stringify({ 
          error: "Error al reclamar la publicación", 
          details: updateError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Programar la liberación automática después de 15 minutos si no se completa
    // Nota: En producción se usaría un sistema de colas como Deno KV o similar
    setTimeout(async () => {
      // Verificar si la publicación sigue reclamada después de 15 minutos
      const { data: currentPost } = await supabase
        .from("posts")
        .select("status, claimed_by")
        .eq("id", postId)
        .single();

      // Si sigue reclamada por el mismo usuario, liberarla
      if (currentPost?.status === "claimed" && currentPost?.claimed_by === userId) {
        await supabase
          .from("posts")
          .update({
            status: "available",
            claimed_by: null,
            claimed_at: null
          })
          .eq("id", postId);
        
        console.log(`Publicación ${postId} liberada automáticamente después de 15 minutos`);
      }
    }, 15 * 60 * 1000); // 15 minutos en milisegundos

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Publicación reclamada exitosamente. Tienes 15 minutos para completar la recolección."
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
