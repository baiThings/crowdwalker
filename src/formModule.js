import { localStorageHandler } from "./localStorage.js";

export let formModule = (function(){
    const toiletTypeName = new Map([
        ['NULL' , '확인필요'],
        ['N' , '개방화장실'],
        ['G' , '공중화장실'],
        ['M' , '이동화장실'],
        ['T', '간이화장실']
     ])
     const toiletIsName = new Map([
        ['NULL' , '확인필요'],
        ['E' , '장애인화장실없음'],
        ['O' , '장애인화장실외부존재'],
        ['I' , '장애인화장실내부존재'],
     ])
     const utilPosName = new Map([
        ['NULL', '확인필요'],
        ['WT', '여자화장실'],
        ['MT', '남자화장실'],
        ['ETC', '기타']
     ])
     const toiletStatusChecked = new Map([
        ['YES' ,true],
        ['NO' , false],
        ['null', null] 
    ])
    
    return {
        formFixed(k, v){
            let formNode;
            try {
                formNode = '<div class="mb-3 mt-3 form-fixed">'+
                '<label class="form-label" >' + v + '</label>'+
                '<input type="text" class="form-control" id='+ k+' value='+ localStorageHandler.getItem(k)+' name='+ k +' readonly>'+
                '</div>'
            } catch (error) {
                console.log("fail to get markerInfo")
            }
            return formNode;
        },
        formInput(k, v){
            let num = 0;
            let formNode; 
            console.log('D'+k + " : " + v);
            // console.log(localStorageHandler.getData()[0]['D'+k]['N']);
            try{   
                if(k =='OpTime') num = parseInt(localStorageHandler.getData()[0]['D'+k]['S']);
                else num = parseInt(localStorageHandler.getData()[0]['D'+k]['N']);
            }
            catch{
                num = 0;
            }
            console.log(num);
            // if(localStorageHandler.getItem('entryFloor') != null){    
            //     num = parseInt(localStorageHandler.getItem(k));
            // }
            try {
                formNode =  '<div class="mb-3 mt-3 form-fixed">'+
                '<label class="form-label" >' + v + '</label>'+
                '<input type="text" class="form-control" id='+ k+' value='+ num + ' name='+ k +'>'+
                '</div>'
            } catch (error) {
                console.log("fail to get markerInfo")
            }
            return formNode;
        },
    
        formROInput(k, v){
            let num = 0;
            let formNode; 
            console.log('D'+k + " : " + v);
            // console.log(localStorageHandler.getData()[0]['D'+k]['N']);
            try{   
                num = parseInt(localStorageHandler.getData()[0]['D'+k]['N']);
            }
            catch{
                num = 0;
            }
            try {
                formNode =  '<div class="mb-3 mt-3 form-fixed">'+
                '<label class="form-label" >' + v + '</label>'+
                '<input type="text" class="form-control" id='+ k+' value='+ num + ' name='+ k +' readonly>'+
                '</div>'
            } catch (error) {
                console.log("fail to get markerInfo")
            }
            return formNode;
        },
        formSelect(k, v){
            let formSelectNode = '';
            let selectedFlag = '';
            let toiletType = '';
            let formNode;
            try {
                toiletType = localStorageHandler.getData()[0]["toiletType"]['S']
            } catch (error) {
                toiletType = 'Null'
            }
            console.log(toiletType)
            for(let [key, value] of toiletTypeName){
                if(value === toiletType) selectedFlag = '<option selected>'
                else selectedFlag = '<option>'
                formSelectNode += selectedFlag + value + '</option>';
             }
            formNode = '<div class="mb-3 mt-3 form-fixed">' + 
            '   <label for='+ k + ' class="form-label">'+v+':</label>' + 
            '   <select class="form-select-list" id='+ k+ ' name='+ k+ '>' +
                 formSelectNode + 
            '   </select>' + 
            '</div>'
            return formNode;
        },
        formSelectToiletIs(k, v){
            let formSelectNode = '';
            let selectedFlag = '';
            let toiletIs = '';
            let formNode;
            try {
                toiletIs = localStorageHandler.getData()[0]["DtoiletIs"]['S']
            } catch (error) {
                toiletIs = 'Null'
            }
            for(let [key, value] of toiletIsName){
                if(key === toiletIs) selectedFlag = '<option selected>'
                else selectedFlag = '<option>'
                formSelectNode += selectedFlag + value + '</option>';
             }
            formNode = '<div class="mb-3 mt-3 form-fixed">' + 
            '   <label for='+ k + ' class="form-label">'+v+':</label>' + 
            '   <select class="form-select-list" id='+ k+ ' name='+ k+ '>' +
                 formSelectNode + 
            '   </select>' + 
            '</div>'
            return formNode;
        },
        formSelectUtilPos(k, v){
            let formSelectNode = '';
            let selectedFlag = '';
            let utilPos = null;
            let formNode;
            console.log(k);
            try {
                if(k == 'publicChildKeepPos'){
                    utilPos = localStorageHandler.getData()[0]["DpublicChildKeepPos"]['S']
                }else{
                    utilPos = localStorageHandler.getData()[0]["DpublicEmerCallPos"]['S']
                }
                } catch (error) {
                utilPos = 'Null'
            }
            for(let [key, value] of utilPosName){
                if(key === utilPos) selectedFlag = '<option selected>'
                else selectedFlag = '<option>'
                formSelectNode += selectedFlag + value + '</option>';
             }
            formNode = '<div class="mb-3 mt-3 form-fixed">' + 
            '   <label for='+ k + ' class="form-label">'+v+':</label>' + 
            '   <select class="form-select-list" id='+ k+ ' name='+ k+ '>' +
                 formSelectNode + 
            '   </select>' + 
            '</div>'
            return formNode;
        },
        formRadio(k, v){
            let formRadioNode = '';
            let formNode;
            let toiletStatus = null;
            try {
                toiletStatus = localStorageHandler.getData()[0][('D'+ k)]['BOOL'];
            } catch (error) {
            }
            for(let [key, bool] of toiletStatusChecked){
                console.log(key + " : " + bool);
                console.log(toiletStatus);
                let flagNode ='';
                if(bool === toiletStatus) flagNode = ' checked="checked"'
                formRadioNode += '<input class="form-radio" type="radio" name="'+k+'" value ="' + key + '"' + flagNode + '><label for="'+key+'">'+ key + '</label>'
            }
            formNode =  '<div class="mb-3 mt-3" id="form-radio">' 
            + '<label for=' + k + 'class="form-label">' + v +':</label>'
            + '<div>' + formRadioNode + '</div>'   
            +'</div>'
            return formNode;
        }
    }
})();
