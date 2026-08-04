
const json=(data,status=200)=>new Response(JSON.stringify(data),{
  status,
  headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"public, max-age=1800"}
});

export async function onRequestGet(){
  const source="https://www.freddiemac.com/pmms";
  try{
    const r=await fetch(source,{headers:{"User-Agent":"BlackstoneRateWatch/2.0"}});
    if(!r.ok) throw new Error("Source unavailable");
    const html=await r.text();
    const text=html.replace(/<script[\s\S]*?<\/script>/gi," ")
      .replace(/<style[\s\S]*?<\/style>/gi," ")
      .replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ")
      .replace(/&amp;/gi,"&").replace(/\s+/g," ");

    const rate30=parseFloat(
      (text.match(/30-year Fixed-Rate Mortgage\s*(\d+\.\d+)%/i)||[])[1]||
      (text.match(/30-year fixed-rate mortgage averaged\s*(\d+\.\d+)%/i)||[])[1]
    );
    const previous30=parseFloat(
      (text.match(/30-year FRM averaged [\d.]+%[^.]{0,180}?last week when it averaged\s*(\d+\.\d+)%/i)||[])[1]
    );
    const date=(text.match(/as of\s+([A-Z][a-z]+ \d{1,2}, \d{4})/i)||[])[1]||
      new Date().toISOString().slice(0,10);

    if(!Number.isFinite(rate30)) throw new Error("Rate not found");
    return json({
      rate30,
      change30:Number.isFinite(previous30)?+(rate30-previous30).toFixed(2):null,
      updated:date,
      source:"Freddie Mac PMMS"
    });
  }catch{
    return json({
      rate30:6.55,
      change30:null,
      updated:"Last verified benchmark",
      source:"Freddie Mac PMMS",
      fallback:true
    });
  }
}
