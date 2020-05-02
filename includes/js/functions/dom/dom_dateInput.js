function dateInput(inputString,runChecks=false){
    let input = createElementFromHtmlString(inputString);
    if(input.tagName!='INPUT'){console.error(input);console.error(`The input string passed does not create an input.`);}
    
    let inputPlaceholder = input.getAttribute('placeholder');
    let inputValueDate = input.value=='' ? new Date() : new Date(input.value);
    
    input.placeholder='';
    input.setAttribute('oninput',`defaultDateInputWithWrapperFunction(this);${input.getAttribute('onchange')};`);
    //~ input.setAttribute('onfocusout',`defaultDateInputWithWrapperFunction(this);${input.getAttribute('onfocusout')};`);
    
    let realInput = convertInputElementToDateInputElement(input,'hidden');
    realInput.readOnly = "readonly"
    input.name='';
    let timeInput = convertInputElementToDateInputElement(input,'time');
    let dateInput = convertInputElementToDateInputElement(input,'date');
    let inputWrapperClasses = ['inputWrapper','inputFilled'];
    if(runChecks){wrapperClasses.push(dt.getTime()!=NaN ? `inputValid` : `inputInvalid`);}
    
    return `
        <div class="singleColumn gridGapSmall">
            <div class="dateInputWrapper flexl2r1 flexGap">
                <div class="${inputWrapperClasses.join(' ')}">
                    ${getHtmlStringFromElement(dateInput)}
                    <div class="inputLabel">${inputPlaceholder} Date</div>
                </div>
                <div class="${inputWrapperClasses.join(' ')}">
                    ${getHtmlStringFromElement(timeInput)}
                    <div class="inputLabel">Time</div>
                </div>
                ${getHtmlStringFromElement(realInput)}
            </div>
        </div>
    `;
}

function dateInputWrapperUpdate(elm){
    inputWrapperUpdate(elm);
    let dateInputWrapper = getParentElementWithClass(elm,'dateInputWrapper');
    let dateString = dateInputWrapper.querySelector('input[type=date]').value;
    let timeString = dateInputWrapper.querySelector('input[type=time]').value;
    
    dateInputWrapper.querySelector('input[type=hidden]').value = 
        convertDateStringAndTimeStringToTimestamp(dateString,timeString);
}

function updateOriginalInputDate(elm){
    let originalElm = getOriginalElementInForm(initElement(elm));
    originalElm.value = elm.value;
}


function convertInputElementToDateInputElement(inputElm,inputType='DATE'){
    inputType = inputType.toLowerCase();
    
    let inputValueDate = inputElm.value=='' ? new Date() : new Date(inputElm.value);
    let newInputElm = copyElm(inputElm);
    
    newInputElm.type = inputType;
    switch(newInputElm.type){
        case 'date': newInputElm.setAttribute('value',inputValueDate.getMyDate());break;
        case 'time': newInputElm.setAttribute('value',inputValueDate.getMyTime());break;
        case 'hidden': newInputElm.value=inputValueDate.getTime();break;
    }
    return newInputElm;
}
