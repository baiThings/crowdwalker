import { localStorageHandler } from "./localStorage.js";

export let formModule = (function(){
    const toiletTypeName = new Map([
        ['NULL' , '확인필요'],
        ['N' , '개방형화장실'],
        ['G' , '공공시설화장실'],
        ['E' , '장애인화장실없음']
     ])
     const toiletStatusChecked = new Map([
        ['YES' ,true],
        ['NO' , false] 
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
            let floor = 1;
            let formNode;
            if(localStorageHandler.getItem('entryFloor') != null){
                floor = parseInt(localStorageHandler.getItem(k));
            }
            try {
                formNode =  '<div class="mb-3 mt-3 form-fixed">'+
                '<label class="form-label" >' + v + '</label>'+
                '<input type="text" class="form-control" id='+ k+' value='+ floor + ' name='+ k +'>'+
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
                toiletType = localStorageHandler.getData()[0]["DtoiletType"]['S']
            } catch (error) {
                toiletType = 'Null'
            }
            for(let [key, value] of toiletTypeName){
                if(key === toiletType) selectedFlag = '<option selected>'
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
            let toiletStatus = false;
            try {
                toiletStatus = localStorageHandler.getData()[0][('D'+ k)]['BOOL'];
            } catch (error) {
            }
            for(let [key, bool] of toiletStatusChecked){
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
