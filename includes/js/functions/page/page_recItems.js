function updateInputOnFormWithNameRci_total(formChild){
    let form = formChild.classList.contains('form') ? formChild : getParentElementWithClass(formChild,'form');
    
    let totalElm = form.querySelector('input[name="rci_total"]')
    let qtyElm = form.querySelector('input[name="rci_qty"]')
    let costPerUnitElm = form.querySelector('input[name="rci_cost_per_unit"]')
    
    totalElm.value = price(parseFloat(qtyElm.value) * parseFloat(costPerUnitElm.value));
}
function changeValueOfInputWithNameRciWorkOnFormToThisValue(elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector('input[name="rci_work"]').value = elmChild.value;
}

function changeValueOfInputWithNameOnFormToThisValue(name,elmChild){
    let form = getParentElementWithClass(elmChild,'form')
    form.querySelector(`input[name="${name}"]`).value = elmChild.value;
}

