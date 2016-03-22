/**
 * Created by cbio on 10/5/15.
 */


function loadXMLDoc(filename) {

    //funda  xhttp.open("GET", filename, false);


    //Funda: added to make asynchronous
    var handleStateChange = function () {
        switch (xhttp.readyState) {
            case 0 : // UNINITIALIZED
            case 1 : // LOADING
            case 2 : // LOADED
            case 3 : // INTERACTIVE
                break;
            case 4 : // COMPLETED
                return xhttp.responseXML;
                break;
            default: alert("error");

        }
    };

    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange=handleStateChange;

    xhttp.open("GET",filename,true);


    xhttp.send();


};

function dynamicResize()
{

    var win = $(this); //this = window

    var windowWidth = win.width() - 80; //80px padding on the left
    var windowHeight = win.height()  - 10; //10px padding at the bottom

    var canvasWidth = 1000;
    var canvasHeight = 680;

    //if (windowWidth > canvasWidth) {
    $("#sbgn-network-container").width(windowWidth * 0.7 );
    $("#sbgn-inspector").width(windowWidth * 0.28);
    $(".nav-menu").width(windowWidth * 0.7);
    $(".navbar").width(windowWidth * 0.7);
    $("#sbgn-toolbar").width(windowWidth * 0.7);
    $("#chat-area").width(windowWidth * 0.28);
    $("#command-history-area").width(windowWidth * 0.28);

//    }

    //    if (windowHeight > canvasHeight) {
    if($("#sbgn-toolbar").width() < (444))
        $("#sbgn-network-container").css('top', '190px');
    else if($("#sbgn-toolbar").width() < (888))
        $("#sbgn-network-container").css('top', '140px');
    else
        $("#sbgn-network-container").css('top', '95px');


    $("#sbgn-network-container").height(windowHeight * 0.9);
    $("#sbgn-inspector").height(windowHeight * 0.20);
    $("#command-history-area").height(windowHeight * 0.21);
    $("#chat-area").height(windowHeight * 0.53);
    //  }
}

$(window).on('resize', dynamicResize);

$(document).ready(function () {
    scrollToBottom('command-history-area');
    scrollToBottom('messages');
    scrollToBottom('receivedImages');


    dynamicResize();
    $('#command-history-area').live('contentchanged', function(){
        scrollToBottom('command-history-area');
    });

    $('#messages').live('contentchanged', function(){
        /* 
           FIXME This is triggered before the DOM is actually updated. Hack
           around it by delaying for 100ms. This is of course not reliable but
           will be good enough for demos.
        */
        setTimeout(function () {
            scrollToBottom('messages');
        }, 100);

    });

    $('#receivedImages').live('contentchanged', function(){
        scrollToBottom('receivedImages');

    });



});
function showQTip(el){
    $(el).parent().qtip({
        content: { text:  function() {

            return "Click image to enlarge ";
        }

        },

        position: {
            my: 'center',
            at: 'center',
            adjust: {
                cyViewport: true
            },
            effect: false
        },
        mouseover: true,
        style: {
            classes: 'qtip-image',

            tip: {
                width: 16,
                height: 8
            }
        }
    });
}

function openImage(el){
    if(el.src){
        var url = el.src;
        window.open(url, 'Image', 'width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');
    }


}



function scrollToBottom(docId){

    document.getElementById(docId).scrollTop = document.getElementById(docId).scrollHeight  - document.getElementById(docId).clientHeight;

}
//Handle keyboard events
$(document).keydown(function (e) {
    if (e.which === 90 && e.ctrlKey) {
        editorActionsManager.undo();
        refreshUndoRedoButtonsStatus();
    }
    else if (e.which === 89 && e.ctrlKey) {
        editorActionsManager.redo();
        refreshUndoRedoButtonsStatus();
    }
});

//Cytoscape extensions
//FUNDA
//cytoscape('collection', 'setWidth', function(val){
//    var ele = this[0];
//    var cy = ele._private.cy;
//    var styleEnabled = cy._private.styleEnabled;
//
//    if( ele ){
//        if( styleEnabled ){
//            ele._private.style.width.pfValue = val ; //this is no more pxValue
//            ele._private.style.width.value = val ;
//            ele._private.style.width.strValue = ""+ Math.floor(val) + "px";
//            ele._private.autoWidth  = val;
//
//        } else {
//
//            ele._private.data.width  = val;
//        }
//    }
//});

var calculatePaddings = function(paddingPercent) {
    //As default use the compound padding value
    if(!paddingPercent){
        paddingPercent = parseInt(sbgnStyleRules['compound-padding'], 10);
    }

    var nodes = cy.nodes();
    var total = 0;
    var numOfSimples = 0;

    for (var i = 0; i < nodes.length; i++) {
        var theNode = nodes[i];
        if (theNode.children() == null || theNode.children().length == 0) {
            var collapsedChildren = theNode._private.data.collapsedChildren;
            if (collapsedChildren == null || collapsedChildren.length == 0) {
                total += Number(theNode._private.data.sbgnbbox.w);
                total += Number(theNode._private.data.sbgnbbox.h);
                numOfSimples++;
            }
            else {
                var result = expandCollapseUtilities.getCollapsedChildrenData(collapsedChildren, numOfSimples, total);
                numOfSimples = result.numOfSimples;
                total = result.total;
            }
        }
    }

    var calc_padding = (paddingPercent / 100) * Math.floor(total / (2 * numOfSimples));

    if (calc_padding < 15) {
        calc_padding = 15;
    }

    return calc_padding;
};

var calculateTilingPaddings = calculatePaddings;
var calculateCompoundPaddings = calculatePaddings;

//FUNDA???
//cytoscape('collection', 'setHeight', function(val){
//    var ele = this[0];
//    var cy = ele._private.cy;
//    var styleEnabled = cy._private.styleEnabled;
//
//    if( ele ){
//        if( styleEnabled ){
//            ele._private.style.height.pfValue = val; //this is no more pxvalue
//            ele._private.style.height.value = val ;
//            ele._private.style.height.strValue = ""+ Math.floor(val) + "px";
//            ele._private.autoHeight  = val;
//        } else {
//
//            ele._private.data.height  = val;
//        }
//    }
//});

var refreshPaddings = function () {

    var calc_padding = calculateCompoundPaddings();

    var nodes = cy.nodes();
    nodes.css('padding-left', 0);
    nodes.css('padding-right', 0);
    nodes.css('padding-top', 0);
    nodes.css('padding-bottom', 0);

    var compounds = nodes.filter('$node > node');

    compounds.css('padding-left', calc_padding);
    compounds.css('padding-right', calc_padding);
    compounds.css('padding-top', calc_padding);
    compounds.css('padding-bottom', calc_padding);
    //To refresh the nodes on the screen apply the preset layout
    makePresetLayout();


};


var makePresetLayout = function () {
    cy.layout({
        name: "preset"
    });
};

//Returns true for unspecified entity,
//simple chemical, macromolecule, nucleic acid feature, and complexes
//As they may have some specific node properties(state variables, units of information etc.)
var isSpecialSBGNNodeClass = function (sbgnclass) {
    if (sbgnclass == 'unspecified entity' || sbgnclass == 'simple chemical'
        || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
        || sbgnclass == 'complex'
        || sbgnclass == 'unspecified entity multimer' || sbgnclass == 'simple chemical multimer'
        || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
        || sbgnclass == 'complex multimer') {
        return true;
    }
    return false;
};


var getNodesData = function () {
    var nodesData = {};
    var nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        nodesData[node.id()] = {
            width: node.width(),
            height: node.height(),
            x: node.position("x"),
            y: node.position("y")
        };
    }
    return nodesData;
};



var relocateStateAndInfos = function (stateAndInfos) {
    var length = stateAndInfos.length;
    if (length == 0) {
        return;
    }
    else if (length == 1) {
        stateAndInfos[0].bbox.x = 0;
        stateAndInfos[0].bbox.y = -50;
    }
    else if (length == 2) {
        stateAndInfos[0].bbox.x = 0;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 0;
        stateAndInfos[1].bbox.y = 50;
    }
    else if (length == 3) {
        stateAndInfos[0].bbox.x = -25;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 25;
        stateAndInfos[1].bbox.y = -50;

        stateAndInfos[2].bbox.x = 0;
        stateAndInfos[2].bbox.y = 50;
    }
    else {
        stateAndInfos[0].bbox.x = -25;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 25;
        stateAndInfos[1].bbox.y = -50;

        stateAndInfos[2].bbox.x = -25;
        stateAndInfos[2].bbox.y = 50;

        stateAndInfos[3].bbox.x = 25;
        stateAndInfos[3].bbox.y = 50;
    }
};

/*
 * This function obtains the info label of the given node by
 * it's children info recursively
 */
function getInfoLabel(node) {
    /*    * Info label of a collapsed node cannot be changed if
     * the node is collapsed return the already existing info label of it
     */
    if (node._private.data.collapsedChildren != null) {
        return node._private.data.infoLabel;
    }

    /*
     * If the node is simple then it's infolabel is equal to it's sbgnlabel
     */
    if (node.children() == null || node.children().length == 0) {
        return node._private.data.sbgnlabel;
    }

    var children = node.children();
    var infoLabel = "";
    /*
     * Get the info label of the given node by it's children info recursively
     */
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var childInfo = getInfoLabel(child);

        if (childInfo == null || childInfo == "") {
            continue;
        }

        if (infoLabel != "") {
            infoLabel += ":";
        }
        infoLabel += childInfo;
    }

    //return info label
    return infoLabel;
}

/*
 * This function create qtip for the given node
 */
function nodeQtipFunction(node) {
    /*    * Check the sbgnlabel of the node if it is not valid
     * then check the infolabel if it is also not valid do not show qtip
     */
    var label = node._private.data.sbgnlabel;

    if (label == null || label == "")
        label = getInfoLabel(node);

    if (label == null || label == "")
        return;

    node.qtip({
        content: function () {
            var contentHtml =
                "<b style='text-align:center;font-size:16px;'>" + label + "</b>";
            var sbgnstatesandinfos = node._private.data.sbgnstatesandinfos;
            for (var i = 0; i < sbgnstatesandinfos.length; i++) {
                var sbgnstateandinfo = sbgnstatesandinfos[i];
                if (sbgnstateandinfo.clazz == "state variable") {
                    var value = sbgnstateandinfo.state.value;
                    var variable = sbgnstateandinfo.state.variable;
                    var stateLabel = (variable == null /*|| typeof stateVariable === undefined */) ? value :
                    value + "@" + variable;
                    if (stateLabel == null) {
                        stateLabel = "";
                    }
                    contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
                }
                else if (sbgnstateandinfo.clazz == "unit of information") {
                    var stateLabel = sbgnstateandinfo.label.text;
                    if (stateLabel == null) {
                        stateLabel = "";
                    }
                    contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
                }
            }
            return contentHtml;
        },
        show: {
            ready: true
        },
        position: {
            my: 'top center',
            at: 'bottom right',
            adjust: {
                cyViewport: true
            }
        },
        style: {
            classes: 'qtip-bootstrap',
            tip: {
                width: 16,
                height: 8
            }
        }
    });
}

var isEPNClass = function (sbgnclass) {
    return (sbgnclass == 'unspecified entity'
    || sbgnclass == 'simple chemical'
    || sbgnclass == 'macromolecule'
    || sbgnclass == 'nucleic acid feature'
    || sbgnclass == 'complex');
};

var isPNClass = function (sbgnclass) {
    return (sbgnclass == 'process'
    || sbgnclass == 'omitted process'
    || sbgnclass == 'uncertain process'
    || sbgnclass == 'association'
    || sbgnclass == 'dissociation');
};

var isLogicalOperator = function (sbgnclass) {
    return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
};

var convenientToEquivalence = function (sbgnclass) {
    return (sbgnclass == 'tag' || sbgnclass == 'terminal');
};

/*
 * This is a debugging function
 */
var printNodeInfo = function () {
    console.log("print node info");
    var nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        console.log(node.data("id") + "\t" + node.data("parent"));
    }
    console.log("print edge info");
    var edges = cy.edges();
    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        console.log(edge.data("id") + "\t" + edge.data("source") + "\t" + edge.data("target"));
    }
};

//get the style properties for the given selector
function getStyleRules(selector) {
    for (var i = 0; i < sbgnStyleSheet.length; i++) {
        var currentStyle = sbgnStyleSheet[i];
        if (currentStyle.selector == selector) {
            return currentStyle.properties;
        }
    }
};


var truncateText = function (textProp, font) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;

    var fitLabelsToNodes = (sbgnStyleRules['fit-labels-to-nodes'] == 'true');

    var text = (typeof textProp.label === 'undefined') ? "" : textProp.label;
    //If fit labels to nodes is false do not truncate
    if (fitLabelsToNodes == false) {
        return text;
    }
    var width;
    var len = text.length;
    var ellipsis = "..";

    //if(context.measureText(text).width < textProp.width)
    //	return text;
    var textWidth = (textProp.width > 30) ? textProp.width - 10 : textProp.width;

    while ((width = context.measureText(text).width) > textWidth) {
        --len;
        text = text.substring(0, len) + ellipsis;
    }
    return text;
};

var getElementContent = function (ele) {
    var sbgnclass = ele.data('sbgnclass');
    if (sbgnclass.endsWith(' multimer')) {
        sbgnclass = sbgnclass.replace(' multimer', '');
    }

    var content = "";
    if (sbgnclass == 'macromolecule' || sbgnclass == 'simple chemical'
        || sbgnclass == 'phenotype' || sbgnclass == 'compartment'
        || sbgnclass == 'unspecified entity' || sbgnclass == 'nucleic acid feature'
        || sbgnclass == 'perturbing agent' || sbgnclass == 'tag') {
        content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
    }
    else if (sbgnclass == 'and') {
        content = 'AND';
    }
    else if (sbgnclass == 'or') {
        content = 'OR';
    }
    else if (sbgnclass == 'not') {
        content = 'NOT';
    }
    else if (sbgnclass == 'omitted process') {
        content = '\\\\';
    }
    else if (sbgnclass == 'uncertain process') {
        content = '?';
    }
    else if (sbgnclass == 'dissociation') {
        content = 'O';
    }

    var textProp = {
        label: content,
        width: ele.data('width') ? ele.data('width') : ele.data('sbgnbbox').w
    };

    var font = getLabelTextSize(ele) + "px Arial";
    return truncateText(textProp, font);
};

var getLabelTextSize = function (ele) {
    var sbgnclass = ele.data('sbgnclass');
    if (sbgnclass.endsWith('process')) {
        return 18;
    }
    return getDynamicLabelTextSize(ele);
};

var getCyShape = function (ele) {
    var shape = ele.data('sbgnclass');
    if (shape.endsWith(' multimer')) {
        shape = shape.replace(' multimer', '');
    }

    if (shape == 'compartment') {
        return 'roundrectangle';
    }
    if (shape == 'phenotype') {
        return 'hexagon';
    }
    if (shape == 'perturbing agent' || shape == 'tag') {
        return 'polygon';
    }
    if (shape == 'source and sink' || shape == 'nucleic acid feature' || shape == 'dissociation'
        || shape == 'macromolecule' || shape == 'simple chemical' || shape == 'complex'
        || shape == 'unspecified entity' || shape == 'process' || shape == 'omitted process'
        || shape == 'uncertain process' || shape == 'association') {
        return shape;
    }
    return 'ellipse';
};
var getCyArrowShape = function (ele) {
    var sbgnclass = ele.data('sbgnclass');
    if (sbgnclass == 'necessary stimulation') {
        return 'necessary stimulation';
//    return 'triangle-tee';
    }
    if (sbgnclass == 'inhibition') {
        return 'tee';
    }
    if (sbgnclass == 'catalysis') {
        return 'circle';
    }
    if (sbgnclass == 'stimulation' || sbgnclass == 'production') {
        return 'triangle';
    }
    if (sbgnclass == 'modulation') {
        return 'diamond';
    }
    return 'none';
};

/*
 * calculates the dynamic label size for the given node
 */
var getDynamicLabelTextSize = function (ele) {
    var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];
    var dynamicLabelSizeCoefficient;

    if (dynamicLabelSize == 'small') {
        dynamicLabelSizeCoefficient = 0.75;
    }
    else if (dynamicLabelSize == 'regular') {
        dynamicLabelSizeCoefficient = 1;
    }
    else if (dynamicLabelSize == 'large') {
        dynamicLabelSizeCoefficient = 1.25;
    }

    //This line will be useless and is to be removed later
//  dynamicLabelSizeCoefficient = dynamicLabelSizeCoefficient ? dynamicLabelSizeCoefficient : 1;

    var h = ele.data('height') ? ele.data('height') : ele.data('sbgnbbox').h;
    var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

    return textHeight;
};
/*
 * get the style rules for .sbgn selector and fill them into sbgnStyleRules map
 */
//function getSBGNStyleRules(){
//    if (window.sbgnStyleRules == null) {
//        var styleRulesList = getStyleRules(".sbgn");
//        window.sbgnStyleRules = {};
//        for (var i = 0; i < styleRulesList.length; i++) {
//            var rule = styleRulesList[i];
//            window.sbgnStyleRules[rule.name] = rule.value;
//        }
//    }
//    return sbgnStyleRules;
//};



var sbgnStyleSheet = cytoscape.stylesheet()
    .selector("node")
    .css({
        'border-width': 1.5,
        'border-color': '#555',
        'background-color': '#f6f6f6',
        'font-size': 11,
//          'shape': 'data(sbgnclass)',
        'background-opacity': 0.5,
    })
    .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
    .css({
        'background-image': 'sampleapp-images/clone_bg.png',
        'background-position-x': '50%',
        'background-position-y': '100%',
        'background-width': '100%',
        'background-height': '25%',
        'background-fit': 'none',
        'background-image-opacity': function (ele) {
            return ele._private.style['background-opacity'].value;
        }
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='process'][sbgnclass!='association'][sbgnclass!='dissociation'][sbgnclass!='compartment'][sbgnclass!='source and sink']")
    .css({
//          'content': 'data(sbgnlabel)',
        'content': function (ele) {
            return getElementContent(ele);
        },
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': function (ele) {
            return getLabelTextSize(ele);
        }
    })
    .selector("node[sbgnclass]")
    .css({
        'shape': function (ele) {
            return getCyShape(ele);
        }
    })
    .selector("node[sbgnclass='perturbing agent']")
    .css({
        'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
    })
    .selector("node[sbgnclass='association']")
    .css({
        'background-color': '#6B6B6B'
    })
    .selector("node[sbgnclass='tag']")
    .css({
        'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
    })
    .selector("node[sbgnclass='complex']")
    .css({
        'background-color': '#F4F3EE',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'font-size': '16'
    })
    .selector("node[sbgnclass='compartment']")
    .css({
        'border-width': 3.75,
        'background-opacity': 0,
        'background-color': '#FFFFFF',
        'content': 'data(sbgnlabel)',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'font-size': '16'
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
    .css({
        'width': 'data(sbgnbbox.w)',
        'height': 'data(sbgnbbox.h)'
    })
    .selector("node:selected")
    .css({
        'border-color': '#d67614',
        'target-arrow-color': '#000',
        'text-outline-color': '#000'})
    .selector("node:active")
    .css({
        'background-opacity': 0.7, 'overlay-color': '#d67614',
        'overlay-padding': '14'
    })
    .selector("edge")
    .css({
        'curve-style': 'bezier',
        'line-color': '#555',
        'target-arrow-fill': 'hollow',
        'source-arrow-fill': 'hollow',
        'width': 1.5,
        'target-arrow-color': '#555',
        'source-arrow-color': '#555',
//          'target-arrow-shape': 'data(sbgnclass)'
    })
    .selector("edge[distances][weights]")
    .css({
        'curve-style': 'segments',
        'segment-distances': function(ele){
            return sbgnBendPointUtilities.getSegmentDistancesString(ele);
        },
        'segment-weights': function(ele){
            return sbgnBendPointUtilities.getSegmentWeightsString(ele);
        }
    })
    .selector("edge[sbgnclass]")
    .css({
        'target-arrow-shape': function (ele) {
            return getCyArrowShape(ele);
        }
    })
    .selector("edge[sbgnclass='inhibition']")
    .css({
        'target-arrow-fill': 'filled'
    })
    .selector("edge[sbgnclass='consumption']")
    .css({
//      'text-background-opacity': 1,
//      'text-background-color': 'white',
//      'text-background-shape': 'roundrectangle',
//      'text-border-color': '#000',
//      'text-border-width': 1,
//      'text-border-opacity': 1,
//      'label': function (ele) {
//        var cardinality = ele.data('sbgncardinality');
//        return cardinality == null || cardinality == 0 ? '' : cardinality;
//      }
        'line-style': 'consumption'
    })
    .selector("edge[sbgnclass='production']")
    .css({
        'target-arrow-fill': 'filled',
        'line-style': 'production'
    })
    .selector("edge:selected")
    .css({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
    })
    .selector("edge:active")
    .css({
        'background-opacity': 0.7, 'overlay-color': '#d67614',
        'overlay-padding': '8'
    })
    .selector("core")
    .css({
        'selection-box-color': '#d67614',
        'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
    })
    .selector(".ui-cytoscape-edgehandles-source")
    .css({
        'border-color': '#5CC2ED',
        'border-width': 3
    })
    .selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
    .css({
        'background-color': '#5CC2ED'
    })
    .selector("edge.ui-cytoscape-edgehandles-preview")
    .css({
        'line-color': '#5CC2ED'
    })
    .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
    .css({
        'shape': 'rectangle',
        'width': 15,
        'height': 15
    })
    .selector('edge.not-highlighted')
    .css({
        'opacity': 0.3,
        'text-opacity': 0.3,
        'background-opacity': 0.3
    })
    .selector('node.not-highlighted')
    .css({
        'border-opacity': 0.3,
        'text-opacity': 0.3,
        'background-opacity': 0.3
    })
    .selector('edge.meta')
    .css({
        'line-color': '#C4C4C4',
        'source-arrow-color': '#C4C4C4',
        'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.meta:selected")
    .css({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
    })
    .selector("node.collapsed")
    .css({
        'width': 60,
        'height': 60
    })
    .selector("node.changeBackgroundOpacity")
    .css({
        'background-opacity': 'data(backgroundOpacity)'
    })
    .selector("node.changeLabelTextSize")
    .css({
        'font-size': function (ele) {
            return getLabelTextSize(ele);
        }
    })
    .selector("node.changeContent")
    .css({
        'content': function (ele) {
            return getElementContent(ele);
        }
    })
    .selector("node.changeBorderColor")
    .css({
        'border-color':'data(borderColor)'
    })
    .selector("node.changeBorderColor:selected")
    .css({
        'border-color': '#d67614'
    })
    .selector("edge.changeLineColor")
    .css({
        'line-color': 'data(lineColor)',
        'source-arrow-color': 'data(lineColor)',
        'target-arrow-color': 'data(lineColor)'
    })
    .selector("edge.changeLineColor:selected")
    .css({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
    })
    .selector('edge.changeLineColor.meta')
    .css({
        'line-color': '#C4C4C4',
        'source-arrow-color': '#C4C4C4',
        'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.changeLineColor.meta:selected")
    .css({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
    });
// end of sbgnStyleSheet

//get the sbgn style rules
//funda getSBGNStyleRules();



