/* RestoPilot - module Équipe */
(function(){
const ROLES={owner:'Propriétaire',manager:'Manager',cashier:'Caissier',server:'Serveur'};
const _shell=shell;
window.shell=function(){
 _shell();
 if(S.role==='owner')document.querySelector('nav').insertAdjacentHTML('beforeend','<button data-t="team" onclick="go(\'team\')">Équipe</button>');
};
V.team=async function(){
 if(S.role!=='owner'){$('#main').innerHTML='<h2>Équipe</h2><p>Réservé au propriétaire.</p>';return}
 const{data,error}=await SB.rpc('rp_list_members',{p_business_id:S.cur.id});
 if(error)throw error;
 $('#main').innerHTML=`<h2>Équipe</h2>
 <div class="card"><label>E-mail de l'employé (il doit déjà avoir créé son compte)</label><input id="te" type="email">
 <label>Rôle</label><select id="tr"><option value="manager">Manager</option><option value="cashier">Caissier</option><option value="server">Serveur</option></select>
 <button onclick="addMember()">Ajouter à l'équipe</button></div>
 <div class="card">${rows(data,m=>`<div class="row"><span>${esc(m.full_name||m.email)}<small>${esc(m.email)} · ${ROLES[m.role]||esc(m.role)}${m.active?'':' · désactivé'}</small></span>
 ${m.role==='owner'?'':`<span style="text-align:right"><select style="width:auto;margin:0 0 6px" onchange="setMember('${m.user_id}',this.value,${m.active})">${['manager','cashier','server'].map(r=>`<option value="${r}" ${r===m.role?'selected':''}>${ROLES[r]}</option>`).join('')}</select><br>
 <button class="${m.active?'bad':'alt'} sm" onclick="setMember('${m.user_id}','${m.role}',${!m.active})">${m.active?'Désactiver':'Réactiver'}</button></span>`}</div>`,'Aucun membre.')}</div>`;
};
window.addMember=async function(){
 const e=$('#te').value.trim();
 if(!e)return toast('Saisis l\'e-mail de l\'employé.',1);
 const{error}=await SB.rpc('rp_add_member',{p_business_id:S.cur.id,p_email:e,p_role:$('#tr').value});
 if(error)return toast(err(error),1);
 toast('Employé ajouté.');go('team');
};
window.setMember=async function(id,role,active){
 const{error}=await SB.rpc('rp_set_member',{p_business_id:S.cur.id,p_user_id:id,p_role:role,p_active:active});
 if(error)return toast(err(error),1);
 toast('Équipe mise à jour.');go('team');
};
})();
