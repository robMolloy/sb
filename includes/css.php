<?php
$bigGap = 20;
$mediumGap = 10;
$smallGap = 5;
$lineHeight = 36;
$gap = $mediumGap;

$bigRadiusSize = 25;
$mediumRadiusSize = $mediumGap;
$smallRadiusSize = $smallGap;
$radiusSize = $mediumRadiusSize;

$smallBorderWidth = 1;
$thickBorderWidth = 2;
$borderWidth = $thickBorderWidth;

$themeColorsArray = ['#222222','#999999','#CCCCCC','#EEEEEE','#FFFFFF','#FFFFFF00'];
$accentColorsArray = ['#151965','#0F4C75','#3282B8','#1E90FF','#BBE1FA'];
$errorColorsArray = ['#FF223322','#FF111177','#FF0000AA','#FF0000CC','#FFCCCC'];

$bg=$bigGap; $mg=$mediumGap; $sg=$smallGap;
$brs=$bigRadiusSize; $srs=$smallRadiusSize;
$sbw=$smallBorderWidth; $tbw=$thickBorderWidth;
$tca=$themeColorsArray; $aca=$accentColorsArray; $eca=$errorColorsArray;

$g = $gap;
$rs = $radiusSize;
$bw = $borderWidth;
$lh = $lineHeight;
?>
/*load fonts*/
@font-face {font-family:'Montserrat';font-style:normal;font-weight:400;src:url('includes/css/fonts/montserrat-v14-latin-regular.eot');src:local('Montserrat Regular'),local('Montserrat-Regular'),url('includes/css/fonts/montserrat-v14-latin-regular.eot?#iefix') format('embedded-opentype'),url('includes/css/fonts/montserrat-v14-latin-regular.woff2') format('woff2'),url('includes/css/fonts/montserrat-v14-latin-regular.woff') format('woff'),url('includes/css/fonts/montserrat-v14-latin-regular.ttf') format('truetype'),url('includes/css/fonts/montserrat-v14-latin-regular.svg#Montserrat') format('svg');}

/*skeleton elements*/
*       {margin:0;padding:0;color:<?php echo $tca[0];?>;box-sizing:border-box;display:flex;}
head    {display:none;}
body    {height:100vh;width:100vw;background-color:<?php echo $tca[3];?>;flex-flow:column;font-family:'Montserrat';}
	
header  {background-color:<?php echo $tca[4]; ?>;border-bottom:2px solid <?php echo $tca[2]; ?>;overflow-x:auto;width:100%;font-weight:600;}
#content{flex:1;overflow-y:auto;position:relative;}
footer {background-color:#FFFFFF;border-top:1px solid <?php echo $tca[2]; ?>;align-items:center;justify-content:center;}

/*elements*/
a   {text-decoration:none;}
textarea {resize:vertical;height:100px;}

input, select {
    height:<?php echo $lh; ?>px;padding:0 <?php echo $g; ?>px;color:<?php echo $tca[0];?>;width:100%;min-width:0px;outline:0;
    background-color:<?php echo $tca[5]; ?>;border:none;
}
input:disabled, select:disabled {color:<?php echo $tca[2]; ?>;}
select {-moz-appearance:none;-webkit-appearance:none;appearance:none;
}
.selectWrapper::after {content:'\25BC';position:absolute;right:<?php echo $g; ?>px;font-size:1.3em;color:<?php echo $tca[2]; ?>;pointer-events:none;}
.selectWrapper:hover::after {font-size:1.4em;color:<?php echo $tca[1]; ?>;}
input[type=datetime-local]::-webkit-inner-spin-button,input[type=date]::-webkit-inner-spin-button,input[type=time]::-webkit-inner-spin-button
    {transform:translateY(50%);}


.inputLabel {
    padding:0 <?php echo $sg; ?>px;margin-left:<?php echo $sg; ?>px;color:<?php echo $tca[1]; ?>;
    background-color:<?php echo $tca[4]; ?>;font-size:0.95em;white-space:nowrap;pointer-events:none;
}
.inputWrapperTitle {font-size:0.7em;color:<?php echo $tca[1]; ?>;}
.inputWrapper {
    position:relative;border:solid 2px <?php echo $tca[2];?>;border-radius:<?php echo $rs; ?>px;
    height:<?php echo $lh; ?>px;width:100%;
}
.inputWrapper > div {
    padding:0 <?php echo $sg; ?>px;position:absolute;top:50%;transform:translateY(-50%);
    width:90%;pointer-events:none;overflow-x:hidden;
}
.inputWrapper:focus-within>div, .inputWrapper.inputFilled>div {top:0;font-size:0.7em;width:auto;}
.inputWrapper.inputValid {border-color:<?php echo $aca[2]; ?>;}
.inputWrapper.inputError {border-color:<?php echo $eca[1]; ?>;}
.inputWrapper.disabled {display:none;}




button {
	border-radius:<?php echo $rs; ?>px;height:<?php echo $lh; ?>px;padding:0 <?php echo $g; ?>px;outline:none;
    min-width:<?php echo $lh; ?>px;background-color:<?php echo $tca[4]; ?>;border:solid 2px <?php echo $aca[2]; ?>;
    display:grid;grid-auto-flow:column;grid-column-gap:<?php echo $g; ?>px;
}
button, button * {
    color:<?php echo $aca[2]; ?>;cursor:pointer;text-decoration:none;font-weight:600;font-size:0.95em;
    justify-content:center;align-items:center;text-transform:uppercase;color:<?php echo $aca[2]; ?>;
    white-space:nowrap;
}
button:hover, button:hover * {background-color:<?php echo $aca[2];?>;color:<?php echo $tca[4]; ?>;}
button div {display:none;}
button div, button div * {font-size:0.7em}
button:hover div {display:flex;}

button.errorButton {border-color:<?php echo $eca[2]; ?>;}
button.errorButton:hover, button.errorButton:hover * {background-color:<?php echo $eca[2];?>;}
button.errorButton * {color:<?php echo $eca[2]; ?>;}

.closeButton {width:<?php echo $lh; ?>px;height:<?php echo $lh; ?>px;justify-content:center;cursor:pointer;font-size:1.25em;}
.closeButton:hover {font-weight:600;}

/*my elements*/
/*don't show scrollbar*/
header  {-ms-overflow-style:none;scrollbar-width:none;}
header::-webkit-scrollbar {display:none;}

header > * {}
header > *:nth-child(1) {flex:1;}
header > * > * {padding:<?php echo $bg; ?>px;border-right:1px solid <?php echo $tca[2]; ?>;min-width:<?php echo 100+2*$g; ?>px;justify-content:center;cursor:pointer;white-space:nowrap;}
header > * > *:hover {background-color:<?php echo $aca[4]; ?>;color:<?php echo $tca[4]; ?>;}
header > * > *.highlight {background-color:<?php echo $aca[2]; ?>;}

#wrapperMain {
    display:block;text-align:center;margin:0 auto;padding:<?php echo $g; ?>px 0;flex:1;overflow-y:scroll;
}
/*don't show scrollbar*/ /**/
#wrapperMain  {-ms-overflow-style:none;scrollbar-width:none;}
#wrapperMain::-webkit-scrollbar {display:none;}
/**/
main {
	min-width:40%;max-width:80vw;text-align:center;overflow-wrap:break-word;
	/*.singleColumn*/
	display:inline-grid;grid-template-columns:repeat(1,auto);grid-row-gap:<?php echo $g; ?>px;
}
main > *:nth-last-child(1) {margin-bottom:<?php echo $sg; ?>px;}


/*my dimensions*/
.h100 {height:100%;}
.lh {height:<?php echo $lh; ?>px;}
.lhSquare {height:<?php echo $lh; ?>px;min-width:<?php echo $lh; ?>px;width:<?php echo $lh; ?>px;}
.mediumSquare {height:<?php echo $lh-$sg; ?>px;min-width:<?php echo $lh-$sg; ?>px;width:<?php echo 2*$lh; ?>px;}
.widthLh {min-width:<?php echo $lh; ?>px;width:<?php echo $lh; ?>px;}
.width2Lh {min-width:<?php echo 2*$lh; ?>px;width:<?php echo 2*$lh; ?>px;}
.width3Lh {min-width:<?php echo 3*$lh; ?>px;width:<?php echo 3*$lh; ?>px;}
.width4Lh {min-width:<?php echo 4*$lh; ?>px;width:<?php echo 4*$lh; ?>px;}
.width5Lh {min-width:<?php echo 5*$lh; ?>px;width:<?php echo 5*$lh; ?>px;}
.widthLhNoBorder {min-width:<?php echo $lh-2*$bw; ?>px;width:<?php echo $lh-2*$bw; ?>px;}
.width2LhNoBorder {min-width:<?php echo 2*$lh-2*$bw; ?>px;width:<?php echo 2*$lh-2*$bw; ?>px;}
.width3LhNoBorder {min-width:<?php echo 3*$lh-2*$bw; ?>px;width:<?php echo 3*$lh-2*$bw; ?>px;}
.width4LhNoBorder {min-width:<?php echo 4*$lh-2*$bw; ?>px;width:<?php echo 4*$lh-2*$bw; ?>px;}
.width5LhNoBorder {min-width:<?php echo 5*$lh-2*$bw; ?>px;width:<?php echo 5*$lh-2*$bw; ?>px;}



/*my panels*/
.panel {
    padding:<?php echo $bg; ?>px;text-align:left;position:relative;background-color:<?php echo $tca[4]; ?>;
    border-radius:<?php echo $brs; ?>px 0 0 0;
    /* Single Column */
    display:grid;grid-template-columns:repeat(1,auto);grid-row-gap:<?php echo $g; ?>px;
}
.singlePanel {margin-top:<?php echo ($g - $sg); ?>px;}
.panel:after{
    content:'';height:<?php echo $brs; ?>px;width:<?php echo $brs; ?>px;background-color:<?php echo $aca[2]; ?>;
    z-index:-1;position:absolute;top:0;left:0;border-radius:<?php echo $sg; ?>px;
}
.panel .panel {padding:0;}
.panel * {align-items:center;}


/*my forms*/
.form {position:relative;display:grid;grid-template-columns:repeat(1,auto);grid-row-gap:<?php echo $g; ?>px;}
.form .form {flex:1;border-top:solid <?php echo $sbw; ?>px <?php echo $tca[2]; ?>;padding-top:<?php echo $g; ?>px;}
.formLabel {
    height:<?php echo $lh; ?>px;width:<?php echo 2*$lh; ?>px;min-width:<?php echo 2*$lh; ?>px;justify-content:center;
    border-top:2px solid <?php echo $tca[2]; ?>;border-bottom:2px solid <?php echo $tca[2]; ?>;white-space:nowrap;
}


/*my columns*/
.singleColumn {display:grid;grid-template-columns:repeat(1,auto);grid-row-gap:<?php echo $g; ?>px;}



/*my rows*/
.equalRow {display:grid;grid-auto-flow:column;grid-auto-columns: 1fr;}
.singleRow {display:grid;grid-auto-flow:column;grid-column-gap:<?php echo $g; ?>px;}



/*my grids*/
.gridl1r2 {display:grid;grid-auto-flow:column;grid-column-gap:<?php echo $g; ?>px;grid-auto-columns:1fr 2fr;}
.gridl2r1 {display:grid;grid-auto-flow:column;grid-column-gap:<?php echo $g; ?>px;grid-auto-columns:2fr 1fr;}

.grid12 {display:grid;grid-auto-flow:column;grid-column-gap:<?php echo $g; ?>px;grid-template-columns: repeat(12, 1fr);}
.grid12 > * {height:100%;}

.ge1 {grid-template-columns: auto;}
.ge2 {grid-template-columns: auto auto;}
.ge3 {grid-template-columns: auto auto auto;}

.gs1 {grid-column: auto / span 1;}
.gs2 {grid-column: auto / span 2;}
.gs3 {grid-column: auto / span 3;}
.gs4 {grid-column: auto / span 4;}
.gs5 {grid-column: auto / span 5;}
.gs6 {grid-column: auto / span 6;}
.gs7 {grid-column: auto / span 7;}
.gs8 {grid-column: auto / span 8;}
.gs9 {grid-column: auto / span 9;}
.gs10 {grid-column: auto / span 10;}
.gs11 {grid-column: auto / span 11;}
.gs12 {grid-column: auto / span 12;}


/*flex*/

.flex1 {flex:1;}
.flex2 {flex:2;}
.flex3 {flex:3;}
.flexAll1 > * {flex:1;}
.flexl1r2 > *:nth-child(1), .flexl2r1 > *:nth-child(2) {flex:1;}
.flexl1r2 > *:nth-child(2), .flexl2r1 > *:nth-child(1) {flex:2;}

/* my gaps */
.pad0 {padding:0px;}
.padSmall {padding:<?php echo $sg; ?>px;}
.padMedium {padding:<?php echo $mg; ?>px;}
.padBig {padding:<?php echo $bg; ?>px;}
.pad {padding:<?php echo $bg; ?>px;}

.gridGap0 {grid-gap:0px;}
.gridGapSmall {grid-gap:<?php echo $sg; ?>px;}
.gridGapMedium {grid-gap:<?php echo $mg; ?>px;}
.gridGapBig {grid-gap:<?php echo $bg; ?>px;}
.gridGap {grid-gap:<?php echo $g; ?>px;}

.flexGap0>*:nth-child(1), .flexGapSmall>*:nth-child(1), .flexGapMedium>*:nth-child(1), .flexGap>*:nth-child(1) 
    {margin-left:0;}
.flexGap0 > * {margin-left:0;}
.flexGapSmall > * {margin-left:<?php echo $sg; ?>px;}
.flexGapMedium > * {margin-left:<?php echo $mg; ?>px;}
.flexGapBig > * {margin-left:<?php echo $bg; ?>px;}
.flexGap > * {margin-left:<?php echo $g; ?>px;}


/*align and justify*/
.justifyLeft, .jl {justify-content:flex-start;}
.justifyRight, .jr {justify-content:flex-end;}
.justifyCenter, .jc {justify-content:center;}
.alignTop, .at {align-items:baseline;}
.alignCenter, .ac {align-items:center;}
.alignBottom, .ab {align-items:end;}
.textAlignLeft, .tal {text-align:left;}
.textAlignRight, .tar {text-align:right;}
.textAlignCenter, .tac {text-align:center;}



/*decorate*/
.border {border:2px solid <?php echo $tca[2]; ?>;}
.borderTop {border-top:2px solid <?php echo $tca[2]; ?>;}
.borderRight {border-right:2px solid <?php echo $tca[2]; ?>;}
.borderBottom {border-bottom:2px solid <?php echo $tca[2]; ?>;}
.borderLeft {border-left:2px solid <?php echo $tca[2]; ?>;}
.borderRadius {border-radius:<?php echo $rs; ?>px;}


/*geometry*/
.triangle {
}


/*position in position:relative parent*/
.topRight {position:absolute;top:0;right:0;}
.topLeft {position:absolute;top:0;left:0;}
.bottomRight {position:absolute;bottom:0;right:0;}
.bottomLeft {position:absolute;bottom:0;left:0;}

.topRight20 {position:absolute;top:20px;right:20px;}
.topLeft20 {position:absolute;top:20px;left:20px;}
.bottomRight20 {position:absolute;bottom:20px;right:20px;}
.bottomLeft20 {position:absolute;bottom:20px;left:20px;}


/*format text*/
.oneLine {white-space:nowrap;}
.nowrap {white-space:nowrap;}


/*font styles*/
.fs70 {font-size:0.7em;}
.fs80 {font-size:0.8em;}
.fs150 {font-size:1.5em;}
.fs200 {font-size:2em;}
.fs300 {font-size:3em;}
.fw100 {font-weight:100;}
.fw600 {font-weight:600;}



.infoBar {position:absolute;min-width:100vw;top:40px;text-align:center;align-items:center;justify-content:center;}
.infoBar > * {padding:20px;background-color:<?php echo $tca[4]; ?>;border:2px solid <?php echo $tca[0]; ?>;}
.notification > * {margin:auto;display:inline-block;background-color:<?php echo $tca[4]; ?>;padding:20px;border:solid 5px <?php echo $aca[4]; ?>;min-width:40vw;max-width:70vw;}


#responseLogIcon {position:absolute;bottom:<?php echo $sg; ?>px;right:<?php echo $sg; ?>px;height:<?php echo 2*$brs; ?>px;width:<?php echo 2*$brs; ?>px;cursor:pointer;z-index:1;background-color:<?php echo $tca[1]; ?>;border-radius:<?php echo $brs; ?>px;}
#responseLogIcon > * {height:100%;width:100%;}
#responseLog {position:fixed;bottom:20px;right:0px;background-color:<?php echo $aca[4]; ?>;overflow-wrap:break-word;min-width:400px;min-height:400px;border-radius:0 0 30px 0;overflow-y:auto;z-index:1;flex-direction:column;}



/*my classes*/
.hidden {display:none !important;}
.error {color:<?php echo $eca[1];?> !important;}
.highlight {background-color:<?php echo $aca[3]; ?>;color:<?php echo $tca[4]; ?>;font-weight:600;}

.click {cursor:pointer;}
.click:active {background-color:<?php echo $tca[3]; ?>;}

.lightText {color:<?php echo $tca[1]; ?>;}
.accentText {color:<?php echo $aca[2]; ?>;}

.lightBg {background-color:<?php echo $tca[3]; ?>;}
.accentBg {background-color:<?php echo $aca[2]; ?>;}

.accentBorder {border-color:<?php echo $aca[2]; ?>;}
.lightAccentBorder {border-color:<?php echo $aca[2]; ?>99;}


.transparent {opacity:0;}

.padLeftRight {padding:0 <?php echo $mg; ?>px;}






@media(max-width:768px){
	button:active {background-color:<?php echo $tca[3];?>;color:<?php echo $tca[2];?>;}
    #wrapperMain {padding-top:<?php echo $sg; ?>px;}
	main {
        min-width:100vw;max-width:100vw;border-left:<?php echo $sg; ?>px solid <?php echo $tca[3]; ?>;
        border-right:<?php echo 1*$sg; ?>px solid <?php echo $tca[3]; ?>;grid-row-gap:<?php echo $sg; ?>px;
    }
}
