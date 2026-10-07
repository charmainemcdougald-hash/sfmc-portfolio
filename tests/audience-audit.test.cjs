const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../ssjs/audience-audit.js'), 'utf8');
const definitions = source.slice(0, source.indexOf('/* Fail the activity'));
const context = { Platform: { Load() {} } };
vm.createContext(context);
vm.runInContext(definitions, context);
const row = (key, email, consent) => ({Properties:[
  {Name:'SubscriberKey',Value:key},{Name:'EmailAddress',Value:email},{Name:'ConsentStatus',Value:consent}
]});
const page = (rows, more=false, id='request-1') => ({Status:'OK',Results:rows,HasMoreRows:more,RequestID:id});
let nextCalls=0;
const result=context.auditAudience({
  retrieve(type, columns) {
    assert.equal(type,'DataExtensionObject[DEMO_MEMBERS]');
    assert.deepEqual(Array.from(columns),['SubscriberKey','EmailAddress','ConsentStatus']);
    return page([row('one','one@example.com','opted-in')],true);
  },
  getNextBatch(type,id) {
    assert.equal(type,'DataExtensionObject[DEMO_MEMBERS]');
    assert.equal(id,'request-1'); nextCalls++;
    return page([row(' ','bad','opted-out'),row('three','three@example.com',' OPTED-IN ')]);
  }
},'DEMO_MEMBERS',100);
assert.deepEqual(JSON.parse(JSON.stringify(result)),{rows:3,missingKey:1,invalidEmail:1,nonOptedIn:1,pages:2});
assert.equal(nextCalls,1);
assert.throws(()=>context.auditAudience({retrieve:()=>null},'DEMO_MEMBERS',100),/incomplete/);
assert.throws(()=>context.auditAudience({retrieve:()=>({Status:'Error',Results:[]})},'DEMO_MEMBERS',100),/failed/);
assert.throws(()=>context.auditAudience({retrieve:()=>page([],true)},'DEMO_MEMBERS',1),/limit/);
assert.throws(()=>context.auditAudience({retrieve:()=>page([],true,'')},'DEMO_MEMBERS',100),/request ID/);
assert.throws(()=>context.auditAudience({},'bad]key',100),/CustomerKey/);
assert.equal(context.auditAudience({retrieve:()=>page([])},'DEMO_MEMBERS',100).rows,0);
console.log('Passed: pagination, hygiene counts, normalization, empty source, failure handling and guards.');
