import {database} from "@/db/connection";
const response=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"no-store"}});
const invalid=(s:string)=>response({error:s},400);
function validOrigin(request:Request){const origin=request.headers.get("origin");return !origin||origin===new URL(request.url).origin;}
function failure(e:unknown){console.error("Charging register error",e);return response({error:"Your register is temporarily unavailable. Please retry. Unsaved details stay in the form."},503);}
export async function GET(){try{const result=await database().prepare("SELECT * FROM devices ORDER BY created_at DESC,id DESC").all();return response({devices:result.results});}catch(e){return failure(e);}}
export async function POST(request:Request){
 if(!validOrigin(request))return response({error:"Request not allowed."},403);
 let p;try{p=await request.json();}catch{return invalid("Please provide valid device details.");}
 if(!p||typeof p.customer!=="string"||!p.customer.trim()||p.customer.trim().length>100||typeof p.device!=="string"||!p.device.trim()||p.device.trim().length>160)return invalid("Enter a customer name and device model.");
 if(!Number.isSafeInteger(p.amount)||p.amount<0||p.amount>1000000000)return invalid("Enter a valid charging fee between 0 and 10,000,000.");
 if(!["unpaid","cash","transfer"].includes(p.payment))return invalid("Choose unpaid, cash or transfer.");
 if(p.contact!==undefined&&(typeof p.contact!=="string"||p.contact.length>40)||p.notes!==undefined&&(typeof p.notes!=="string"||p.notes.length>500))return invalid("Contact or notes are too long.");
 try{const now=new Date().toISOString();const device=await database().prepare("INSERT INTO devices(customer,contact,device,notes,amount,payment,status,created_at,paid_at) VALUES(?,?,?,?,?,?,'charging',?,?) RETURNING *").bind(p.customer.trim(),p.contact?.trim()||"",p.device.trim(),p.notes?.trim()||"",p.amount,p.payment,now,p.payment==="unpaid"?null:now).first();return response({device},201);}catch(e){return failure(e);}
}
export async function PATCH(request:Request){
 if(!validOrigin(request))return response({error:"Request not allowed."},403);
 let p;try{p=await request.json();}catch{return invalid("Invalid update.");}
 if(!p||!Number.isSafeInteger(p.id)||p.id<1||!["cash","transfer","ready","collected"].includes(p.action))return invalid("Invalid ticket or action.");
 try{const db=database(),now=new Date().toISOString();let row;
 if(p.action==="cash"||p.action==="transfer")row=await db.prepare("UPDATE devices SET payment=?,paid_at=? WHERE id=? AND payment='unpaid' RETURNING *").bind(p.action,now,p.id).first();
 else if(p.action==="ready")row=await db.prepare("UPDATE devices SET status='ready' WHERE id=? AND status='charging' RETURNING *").bind(p.id).first();
 else row=await db.prepare("UPDATE devices SET status='collected',collected_at=? WHERE id=? AND status!='collected' AND payment!='unpaid' RETURNING *").bind(now,p.id).first();
 if(!row){const current=await db.prepare("SELECT * FROM devices WHERE id=?").bind(p.id).first();if(!current)return response({error:"Ticket not found."},404);if(current.payment===p.action||current.status===p.action)return response({device:current});return response({error:p.action==="collected"?"Record payment before collecting this device.":"This ticket has changed. Refresh the register and try again."},409);}
 return response({device:row});}catch(e){return failure(e);}
}
