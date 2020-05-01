class contact extends winObject{
    static getWinObjectType(){
        return 'contacts';
    }
    
    static getFormPanelHtml(contact){
        return `<div class="panel form">
        <div class="inputWrapper inputValid">
            <input type="text" name="con_id" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">Id</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_usr_id" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">User Id</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_cus_id" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">Customer Id</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_type" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">type</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_method" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">method</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_description" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">Description</div>
        </div>
        <div class="inputWrapper">
            <input type="text" name="con_address" placeholder="" value="" class="" oninput="defaultInputWithWrapperFunction(this);" onfocus="this.oninput();" onfocusout="this.oninput();">
            <div class="inputLabel">Address</div>
        </div>
                    <div class="jr"><span class="button" onclick="contact.addObjectFromAnyElementInForm(this);">Save contact</span></div>
                </div>`;
    }
}
