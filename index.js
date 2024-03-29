/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

var tinymceOption = {
  theme: 'silver',
  width: 800,
  height: 400,
  plugins: ['advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    'save table directionality emoticons template paste'],
  // content_css: 'css/content.css',
  // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify ' +
  //   '| bullist numlist outdent indent | link image | print preview media fullpage ' +
  //   '| forecolor backcolor emoticons',
  // style_formats: [
  //   {title: 'Bold text', inline: 'b'},
  //   {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
  //   {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
  //   {title: 'Example 1', inline: 'span', classes: 'example1'},
  //   {title: 'Example 2', inline: 'span', classes: 'example2'},
  //   {title: 'Table styles'},
  //   {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
  // ]
};

IMParts_Catalog['tinymce'] = {
  instantiate: function (parentNode) {
    let newId = parentNode.getAttribute('id') + '-e';
    this.ids.push(newId);
    let newNode = document.createElement('TEXTAREA');
    newNode.setAttribute('id', newId);
    newNode.setAttribute('class', '_im_tinymce');
    parentNode.appendChild(newNode);
    this.ids.push(newId);

    parentNode._im_getComponentId = (function () {
      let theId = newId;
      return function () {
        return theId;
      };
    })();
    parentNode._im_setValue = (function () {
      let aNode = newNode;
      return function (str) {
        aNode.innerHTML = str;
      };
    })();
  },
  ids: [],
  finish: function (update) {
    update = (update === undefined) ? true : update;
    if (!tinymceOption) {
      tinymceOption = {};
    }
    if (update) {
      tinymceOption.setup = function (ed) {
        ed.on('change', (function () {
          let updateRquired = update;
          return function (ev) {
            if (updateRquired) {
              IMLibUI.valueChange(ed.id);
            }
          };
        })());
        ed.on('keydown', function (ev) {
          //IMLibUI.keyDown(ev);
        });
        ed.on('keyup', function (ev) {
          //IMLibUI.keyUp(ev);
        });
      };
    } else {
      tinymceOption.setup = null;
    }

    for (let i = 0; i < this.ids.length; i++) {
      let targetNode = document.getElementById(this.ids[i]);
      let targetId = this.ids[i];
      tinymceOption.selector = '#' + targetId;
      tinyMCE.init(tinymceOption);
      if (targetNode) {
        targetNode._im_getValue = (function () {
          let thisId = targetId;
          return function () {
            return tinymce.EditorManager.get(thisId).getContent();
          };
        })();
      }
    }

    this.ids = [];
  }
};
