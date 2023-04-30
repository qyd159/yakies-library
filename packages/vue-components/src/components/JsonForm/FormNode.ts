import { toRaw } from 'vue';
import { map, each, clone, find, uniqueId, isString, isObject, template, extend, max, isSet, isFunction } from 'lodash';
import { applyArrayPath, escapeSelector, getSchemaKey, slugify, getObjKey, setObjKey, truncateToArrayDepth } from './utils';
import FormTree from './FormTree';
/**
 * Represents a node in the form.
 *
 * Nodes that have an ID are linked to the corresponding DOM element
 * when rendered
 *
 * Note the form element and the schema elements that gave birth to the
 * node may be shared among multiple nodes (in the case of arrays).
 *
 * @class
 */
export default class FormNode {
  /**
   * The node's ID (may not be set)
   */
  id?: string;

  name;
  /**
   * The node's key path (may not be set)
   */
  key: string = ''

  keydash = null;

  /**
   * DOM element associated witht the form element.
   *
   * The DOM element is set when the form element is rendered.
   */
  el = null;

  /**
   * Link to the form element that describes the node's layout
   * (note the form element is shared among nodes in arrays)
   */
  formElement: any;

  /**
   * Link to the schema element that describes the node's value constraints
   * (note the schema element is shared among nodes in arrays)
   */
  schemaElement: any;

  /**
   * Pointer to the "view" associated with the node, typically the right
   * object in jsonform.elementTypes
   */
  view: any;

  /**
   * Node's subtree (if one is defined)
   */
  children: FormNode[] = [];

  /**
   * A pointer to the form tree the node is attached to
   */
  ownerTree?: FormTree;

  /**
   * A pointer to the parent node of the node in the tree
   */
  parentNode?: FormNode;

  /**
   * Child template for array-like nodes.
   *
   * The child template gets cloned to create new array items.
   */
  childTemplate?: FormNode;


  /**
   * Direct children of array-like containers may use the value of a
   * specific input field in their subtree as legend. The link to the
   * legend child is kept here and initialized in computeInitialValues
   * when a child sets "valueInLegend"
   */
  legendChild: any;


  /**
   * The path of indexes that lead to the current node when the
   * form element is not at the root array level.
   *
   * Note a form element may well be nested element and still be
   * at the root array level. That's typically the case for "fieldset"
   * elements. An array level only gets created when a form element
   * is of type "array" (or a derivated type such as "tabarray").
   *
   * The array path of a form element linked to the foo[2].bar.baz[3].toto
   * element in the submitted values is [2, 3] for instance.
   *
   * The array path is typically used to compute the right ID for input
   * fields. It is also used to update positions when an array item is
   * created, moved around or suppressed.
   *
   * @type {Array(Number)}
   */
  arrayPath: any = [];

  /**
   * Position of the node in the list of children of its parents
   */
  childPos = 0;

  value;
  defaultValue;
  options

  visible = true;

  legend: any

  /**
 * Clones a node
 *
 * @function
 * @param {formNode} New parent node to attach the node to
 * @return {formNode} Cloned node
 */
  clone(parentNode?: FormNode) {
    var node = new FormNode();
    node.arrayPath = clone(this.arrayPath);
    node.ownerTree = this.ownerTree;
    node.parentNode = parentNode || this.parentNode;
    node.formElement = this.formElement;
    node.schemaElement = this.schemaElement;
    node.view = this.view;
    node.children = map(this.children, function (child) {
      return child.clone(node);
    });
    if (this.childTemplate) {
      node.childTemplate = this.childTemplate.clone(node);
    }
    return node;
  };


  /**
   * Returns true if the subtree that starts at the current node
   * has some non empty value attached to it
   */
  hasNonDefaultValue() {

    // hidden elements don't count because they could make the wrong selectfieldset element active
    if (this.formElement && this.formElement.type == "hidden") {
      return false;
    }

    if (this.value && !this.defaultValue) {
      return true;
    }
    var child = find(this.children, function (child) {
      return child.hasNonDefaultValue();
    });
    return !!child;
  };


  /**
   * Attaches a child node to the current node.
   *
   * The child node is appended to the end of the list.
   *
   * @function
   * @param {formNode} node The child node to append
   * @return {formNode} The inserted node (same as the one given as parameter)
   */
  appendChild(node: FormNode) {
    node.parentNode = this;
    node.childPos = this.children.length;
    this.children.push(node);
    return node;
  };


  /**
   * Removes the last child of the node.
   *
   * @function
   */
  removeChild() {
    var child = this.children[this.children.length - 1];
    if (!child) return;

    // Remove the child from the DOM
    // TODO
    // $(child.el).remove();

    // Remove the child from the array
    return this.children.pop();
  };


  /**
   * Moves the user entered values set in the current node's subtree to the
   * given node's subtree.
   *
   * The target node must follow the same structure as the current node
   * (typically, they should have been generated from the same node template)
   *
   * The current node MUST be rendered in the DOM.
   *
   * TODO: when current node is not in the DOM, extract values from formNode.value
   * properties, so that the function be available even when current node is not
   * in the DOM.
   *
   * Moving values around allows to insert/remove array items at arbitrary
   * positions.
   *
   * @function
   * @param {formNode} node Target node.
   */
  moveValuesTo(node) {
    var values = this.getFormValues(node.arrayPath);
    node.resetValues();
    node.computeInitialValues(values, true);
  };


  /**
   * Switches nodes user entered values.
   *
   * The target node must follow the same structure as the current node
   * (typically, they should have been generated from the same node template)
   *
   * Both nodes MUST be rendered in the DOM.
   *
   * TODO: update getFormValues to work even if node is not rendered, using
   * formNode's "value" property.
   *
   * @function
   * @param {formNode} node Target node
   */
  switchValuesWith(node) {
    var values = this.getFormValues(node.arrayPath);
    var nodeValues = node.getFormValues(this.arrayPath);
    node.resetValues();
    node.computeInitialValues(values, true);
    this.resetValues();
    this.computeInitialValues(nodeValues, true);
  };


  /**
   * Resets all DOM values in the node's subtree.
   *
   * This operation also drops all array item nodes.
   * Note values are not reset to their default values, they are rather removed!
   *
   * @function
   */
  resetValues() {
    var params = null;
    var idx = 0;

    // Reset value
    this.value = null;

    // Propagate the array path from the parent node
    // (adding the position of the child for nodes that are direct
    // children of array-like nodes)
    if (this.parentNode) {
      this.arrayPath = clone(this.parentNode.arrayPath);
      if (this.parentNode.view && this.parentNode.view.array) {
        this.arrayPath.push(this.childPos);
      }
    }
    else {
      this.arrayPath = [];
    }

    if (this.view && this.view.inputfield) {
      // Simple input field, extract the value from the origin,
      // set the target value and reset the origin value
      // TODO: UI上呈现
      /*  params = $(':input', this.el).serializeArray();
       each(params, function (param) {
         // TODO: check this, there may exist corner cases with this approach
         // (with multiple checkboxes for instance)
         $('[name="' + escapeSelector(param.name) + '"]', $(this.el)).val('');
       }); */
    }
    else if (this.view && this.view.array) {
      // The current node is an array, drop all children
      while (this.children.length > 0) {
        this.removeChild();
      }
    }

    // Recurse down the tree
    each(this.children, function (child) {
      child.resetValues();
    });
  };


  /**
   * Sets the child template node for the current node.
   *
   * The child template node is used to create additional children
   * in an array-like form element. The template is never rendered.
   *
   * @function
   * @param {formNode} node The child template node to set
   */
  setChildTemplate(node) {
    this.childTemplate = node;
    node.parentNode = this;
  };


  /**
   * Recursively sets values to all nodes of the current subtree
   * based on previously submitted values, or based on default
   * values when the submitted values are not enough
   *
   * The function should be called once in the lifetime of a node
   * in the tree. It expects its parent's arrayPath to be up to date.
   *
   * Three cases may arise:
   * 1. if the form element is a simple input field, the value is
   * extracted from previously submitted values of from default values
   * defined in the schema.
   * 2. if the form element is an array-like node, the child template
   * is used to create as many children as possible (and at least one).
   * 3. the function simply recurses down the node's subtree otherwise
   * (this happens when the form element is a fieldset-like element).
   *
   * @function
   * @param {Object} values Previously submitted values for the form
   * @param {Boolean} ignoreDefaultValues Ignore default values defined in the
   *  schema when set.
   */
  computeInitialValues(values = null, ignoreDefaultValues = false) {
    var self = this;
    var node: FormNode;
    var nbChildren = 1;
    var i = 0;
    var formData = this.ownerTree!.formDesc.tpldata || {};

    // Propagate the array path from the parent node
    // (adding the position of the child for nodes that are direct
    // children of array-like nodes)
    if (this.parentNode) {
      this.arrayPath = clone(this.parentNode.arrayPath);
      if (this.parentNode.view && this.parentNode.view.array) {
        this.arrayPath.push(this.childPos);
      }
    }
    else {
      this.arrayPath = [];
    }

    // Prepare special data param "idx" for templated values
    // (is is the index of the child in its wrapping array, starting
    // at 1 since that's more human-friendly than a zero-based index)
    formData.idx = (this.arrayPath.length > 0) ?
      this.arrayPath[this.arrayPath.length - 1] + 1 :
      this.childPos + 1;

    // Prepare special data param "value" for templated values
    formData.value = '';

    // Prepare special function to compute the value of another field
    formData.getValue = function (key) {
      if (!values) {
        return '';
      }
      var returnValue = values;
      var listKey = key.split('[].');
      var i;
      for (i = 0; i < listKey.length - 1; i++) {
        returnValue = returnValue[listKey[i]][self.arrayPath[i]];
      }
      return returnValue[listKey[i]];
    };

    if (this.formElement) {
      // Compute the ID of the field (if needed)
      if (this.formElement.id) {
        this.id = applyArrayPath(this.formElement.id!, this.arrayPath);
      }
      else if (this.view && this.view.array) {
        this.id = escapeSelector(this.ownerTree!.formDesc.prefix) +
          '-elt-counter-' + uniqueId();
      }
      else if (this.parentNode && this.parentNode.view &&
        this.parentNode.view.array) {
        // Array items need an array to associate the right DOM element
        // to the form node when the parent is rendered.
        this.id = escapeSelector(this.ownerTree!.formDesc.prefix) +
          '-elt-counter-' + uniqueId();
      }
      else if ((this.formElement.type === 'button') ||
        (this.formElement.type === 'selectfieldset') ||
        (this.formElement.type === 'question') ||
        (this.formElement.type === 'buttonquestion')) {
        // Buttons do need an id for "onClick" purpose
        this.id = escapeSelector(this.ownerTree!.formDesc.prefix) +
          '-elt-counter-' + uniqueId();
      }

      // Compute the actual key (the form element's key is index-free,
      // i.e. it looks like foo[].bar.baz[].truc, so we need to apply
      // the array path of the node to get foo[4].bar.baz[2].truc)
      if (this.formElement.key) {
        this.key = applyArrayPath(this.formElement.key, this.arrayPath);
        this.keydash = slugify(this.key.replace(/\./g, '---'));
      }

      // Same idea for the field's name
      this.name = applyArrayPath(this.formElement.name, this.arrayPath);

      // Consider that label values are template values and apply the
      // form's data appropriately (note we also apply the array path
      // although that probably doesn't make much sense for labels...)
      each([
        'title',
        'legend',
        'description',
        'append',
        'prepend',
        'inlinetitle',
        'helpvalue',
        'value',
        'disabled',
        'placeholder',
        'readOnly'
      ], (prop) => {
        if (isString(this.formElement[prop])) {
          if (this.formElement[prop].indexOf('{{values.') !== -1) {
            // This label wants to use the value of another input field.
            // Convert that construct into {{jsonform.getValue(key)}} for
            // Underscore to call the appropriate function of formData
            // when template gets called (note calling a function is not
            // exactly Mustache-friendly but is supported by Underscore).
            this[prop] = this.formElement[prop].replace(
              /\{\{values\.([^\}]+)\}\}/g,
              '{{getValue("$1")}}');
          }
          else {
            // Note applying the array path probably doesn't make any sense,
            // but some geek might want to have a label "foo[].bar[].baz",
            // with the [] replaced by the appropriate array path.
            this[prop] = applyArrayPath(this.formElement[prop], this.arrayPath);
          }
          // if (this[prop]) {
          //   this[prop] = template(this[prop], valueTemplateSettings)(formData);
          // }
        }
        else {
          this[prop] = this.formElement[prop];
        }
      });

      // Apply templating to options created with "titleMap" as well
      if (this.formElement.options) {
        this.options = map(this.formElement.options, function (option) {
          var title = null;
          if (option && option.title) {
            // See a few lines above for more details about templating
            // preparation here.
            if (option.title.indexOf('{{values.') !== -1) {
              title = option.title.replace(
                /\{\{values\.([^\}]+)\}\}/g,
                '{{getValue("$1")}}');
            }
            else {
              title = applyArrayPath(option.title, self.arrayPath);
            }
            return extend({}, option, {
              value: (isSet(option.value) ? option.value : ''),
              title
            });
          }
          else {
            return option;
          }
        });
      }
    }

    if (this.view && this.view.inputfield && this.schemaElement) {
      // Case 1: simple input field
      if (values) {
        // Form has already been submitted, use former value if defined.
        // Note we won't set the field to its default value otherwise
        // (since the user has already rejected it)
        if (isSet(getObjKey(values, this.key))) {
          this.value = getObjKey(values, this.key);
        }
      }
      else if (!ignoreDefaultValues) {
        // No previously submitted form result, use default value
        // defined in the schema if it's available and not already
        // defined in the form element
        if (!isSet(this.value) && isSet(this.schemaElement['default'])) {
          this.value = this.schemaElement['default'];
          if (isFunction(this.value)) {
            this.value = this.value.apply(this)
          } else if (isString(this.value)) {
            if (this.value.indexOf('{{values.') !== -1) {
              // This label wants to use the value of another input field.
              // Convert that construct into {{jsonform.getValue(key)}} for
              // Underscore to call the appropriate function of formData
              // when template gets called (note calling a function is not
              // exactly Mustache-friendly but is supported by Underscore).
              this.value = this.value.replace(
                /\{\{values\.([^\}]+)\}\}/g,
                '{{getValue("$1")}}');
            }
            else {
              // Note applying the array path probably doesn't make any sense,
              // but some geek might want to have a label "foo[].bar[].baz",
              // with the [] replaced by the appropriate array path.
              this.value = applyArrayPath(this.value, this.arrayPath);
            }
            // if (this.value) {
            //   this.value = template(this.value, valueTemplateSettings)(formData);
            // }
          }
          this.defaultValue = true;
        }
      }
    }
    else if (this.view && this.view.array) {
      // Case 2: array-like node
      nbChildren = 0;
      // const value = formData.getValue(node.key)
      if (values) {
        nbChildren = this.getPreviousNumberOfItems(values, this.arrayPath);
      }
      // TODO: use default values at the array level when form has not been
      // submitted before. Note it's not that easy because each value may
      // be a complex structure that needs to be pushed down the subtree.
      // The easiest way is probably to generate a "values" object and
      // compute initial values from that object
      /*
      else if (this.schemaElement['default']) {
        nbChildren = this.schemaElement['default'].length;
      }
      */
      else if (nbChildren === 0) {
        // If form has already been submitted with no children, the array
        // needs to be rendered without children. If there are no previously
        // submitted values, the array gets rendered with one empty item as
        // it's more natural from a user experience perspective. That item can
        // be removed with a click on the "-" button.
        nbChildren = 1;
      }
      const nodes = getObjKey(values, this.key)
      nbChildren = nodes ? nodes.length : 0;
      let childTemplate = this.childTemplate!;
      if (nbChildren > 0 && (childTemplate.schemaElement.type === 'link' || childTemplate.schemaElement.ref)) {
        const { type, properties } = JSON.parse(JSON.stringify(getSchemaKey(this.ownerTree!.formDesc.schema.properties, childTemplate.schemaElement.ref)));
        Object.assign(childTemplate.schemaElement, { type, properties });
        childTemplate = this.ownerTree!.buildFromLayout({ key: childTemplate.formElement.key })
        this.setChildTemplate(childTemplate)
      }
      if (childTemplate.schemaElement.type === 'link') {
        nbChildren = 1
      }
      for (i = 0; i < nbChildren; i++) {
        this.appendChild(childTemplate.clone());
      }
    } else if (this.schemaElement && this.schemaElement.type === 'link') {
      const { type, properties } = JSON.parse(JSON.stringify(getSchemaKey(this.ownerTree!.formDesc.schema.properties, this.schemaElement.ref)));
      Object.assign(this.schemaElement, { type, properties })
    }
    // Case 3 and in any case: recurse through the list of children
    each(this.children, function (child) {
      child.computeInitialValues(values, ignoreDefaultValues);
    });

    // If the node's value is to be used as legend for its "container"
    // (typically the array the node belongs to), ensure that the container
    // has a direct link to the node for the corresponding tab.
    if (this.formElement && this.formElement.valueInLegend) {
      node = this;
      while (node) {
        if (node.parentNode &&
          node.parentNode.view &&
          node.parentNode.view.array) {
          node.legendChild = this;
          if (node.formElement && node.formElement.legend) {
            node.legend = applyArrayPath(node.formElement.legend, node.arrayPath);
            formData.idx = (node.arrayPath.length > 0) ?
              node.arrayPath[node.arrayPath.length - 1] + 1 :
              node.childPos + 1;
            formData.value = isSet(this.value) ? this.value : '';
            // node.legend = template(node.legend, valueTemplateSettings)(formData);
            break;
          }
        }
        node = node.parentNode!;
      }
    }
  };


  /**
   * Returns the number of items that the array node should have based on
   * previously submitted values.
   *
   * The whole difficulty is that values may be hidden deep in the subtree
   * of the node and may actually target different arrays in the JSON schema.
   *
   * @function
   * @param {Object} values Previously submitted values
   * @param {Array(Number)} arrayPath the array path we're interested in
   * @return {Number} The number of items in the array
   */
  getPreviousNumberOfItems(values, arrayPath) {
    var key;
    var arrayValue;
    var childNumbers;
    var idx = 0;

    if (!values) {
      // No previously submitted values, no need to go any further
      return 0;
    }

    if (this.view.inputfield && this.schemaElement) {
      // Case 1: node is a simple input field that links to a key in the schema.
      // The schema key looks typically like:
      //  foo.bar[].baz.toto[].truc[].bidule
      // The goal is to apply the array path and truncate the key to the last
      // array we're interested in, e.g. with an arrayPath [4, 2]:
      //  foo.bar[4].baz.toto[2]
      key = truncateToArrayDepth(this.formElement.key, arrayPath.length);
      key = applyArrayPath(key, arrayPath);
      arrayValue = getObjKey(values, key);
      if (!arrayValue) {
        // No key? That means this field had been left empty
        // in previous submit
        return 0;
      }
      childNumbers = map(this.children, function (child) {
        return child.getPreviousNumberOfItems(values, arrayPath);
      });
      return max([max(childNumbers) || 0, arrayValue.length]);
    }
    else if (this.view.array) {
      // Case 2: node is an array-like node, look for input fields
      // in its child template
      return this.childTemplate!.getPreviousNumberOfItems(values, arrayPath);
    }
    else {
      // Case 3: node is a leaf or a container,
      // recurse through the list of children and return the maximum
      // number of items found in each subtree
      childNumbers = map(this.children, function (child) {
        return child.getPreviousNumberOfItems(values, arrayPath);
      });
      return childNumbers.length ? max(childNumbers) : 0;
    }
  };


  /**
   * Returns the structured object that corresponds to the form values entered
   * by the user for the node's subtree.
   *
   * The returned object follows the structure of the JSON schema that gave
   * birth to the form.
   *
   * Obviously, the node must have been rendered before that function may
   * be called.
   *
   * @function
   * @param {Array(Number)} updateArrayPath Array path to use to pretend that
   *  the entered values were actually entered for another item in an array
   *  (this is used to move values around when an item is inserted/removed/moved
   *  in an array)
   * @return {Object} The object that follows the data schema and matches the
   *  values entered by the user.
   */
  getFormValues(updateArrayPath?) {
    console.log(this.ownerTree!.form.getFieldsValue())
    // The values object that will be returned
    return this.ownerTree!.form.getFieldsValue()

    if (!this.el) {
      throw new Error('formNode.getFormValues can only be called on nodes that are associated with a DOM element in the tree');
    }
  };


  /**
   * Inserts an item in the array at the requested position and renders the item.
   *
   * @function
   * @param {Number} idx Insertion index
   */
  insertArrayItem(idx, domElement = null) {
    var i = 0;

    // Insert element at the end of the array if index is not given
    if (idx === undefined) {
      idx = this.children.length;
    }

    // Create the additional array item at the end of the list,
    // using the item template created when tree was initialized
    // (the call to resetValues ensures that 'arrayPath' is correctly set)
    var child = this.childTemplate!.clone();
    this.appendChild(child);
    child.resetValues();

    // To create a blank array item at the requested position,
    // shift values down starting at the requested position
    // one to insert (note we start with the end of the array on purpose)
    for (i = this.children.length - 2; i >= idx; i--) {
      this.children[i].moveValuesTo(this.children[i + 1]);
    }

    // Initialize the blank node we've created with default values
    // this.children[idx].resetValues();
    this.children[idx].computeInitialValues();

    // Re-render all children that have changed
    // for (i = idx; i < this.children.length; i++) {
    //   this.children[i].render(domElement);
    // }
    return this.children[idx];
  };


  /**
   * Remove an item from an array
   *
   * @function
   * @param {Number} idx The index number of the item to remove
   */
  deleteArrayItem(idx) {
    var i = 0;
    var child = null;

    // Delete last item if no index is given
    if (idx === undefined) {
      idx = this.children.length - 1;
    }

    // Move values up in the array
    for (i = idx; i < this.children.length - 1; i++) {
      this.children[i + 1].moveValuesTo(this.children[i]);
      // this.children[i].render();
    }

    // Remove the last array item from the DOM tree and from the form tree
    return this.removeChild();
  };

  /**
   * Returns the minimum/maximum number of items that an array field
   * is allowed to have according to the schema definition of the fields
   * it contains.
   *
   * The function parses the schema definitions of the array items that
   * compose the current "array" node and returns the minimum value of
   * "maxItems" it encounters as the maximum number of items, and the
   * maximum value of "minItems" as the minimum number of items.
   *
   * The function reports a -1 for either of the boundaries if the schema
   * does not put any constraint on the number of elements the current
   * array may have of if the current node is not an array.
   *
   * Note that array boundaries should be defined in the JSON Schema using
   * "minItems" and "maxItems". The code also supports "minLength" and
   * "maxLength" as a fallback, mostly because it used to by mistake (see #22)
   * and because other people could make the same mistake.
   *
   * @function
   * @return {Object} An object with properties "minItems" and "maxItems"
   *  that reports the corresponding number of items that the array may
   *  have (value is -1 when there is no constraint for that boundary)
   */
  getArrayBoundaries() {
    var boundaries = {
      minItems: -1,
      maxItems: -1
    };
    if (!this.view || !this.view.array) return boundaries;

    function getNodeBoundaries(node: FormNode, initialNode: any = null) {
      var schemaKey: any;
      var arrayKey = '';
      var boundaries = {
        minItems: -1,
        maxItems: -1
      };

      initialNode = initialNode || node;

      if (node.view && node.view.array && (node !== initialNode)) {
        // New array level not linked to an array in the schema,
        // so no size constraints
        return boundaries;
      }

      if (node.key) {
        // Note the conversion to target the actual array definition in the
        // schema where minItems/maxItems may be defined. If we're still looking
        // at the initial node, the goal is to convert from:
        //  foo[0].bar[3].baz to foo[].bar[].baz
        // If we're not looking at the initial node, the goal is to look at the
        // closest array parent:
        //  foo[0].bar[3].baz to foo[].bar
        arrayKey = node.key.replace(/\[[0-9]+\]/g, '[]');
        if (node !== initialNode) {
          arrayKey = arrayKey.replace(/\[\][^\[\]]*$/, '');
        }
        schemaKey = getSchemaKey(
          node.ownerTree!.formDesc.schema.properties,
          arrayKey
        );
        if (!schemaKey) return boundaries;
        return {
          minItems: schemaKey.minItems || schemaKey.minLength || -1,
          maxItems: schemaKey.maxItems || schemaKey.maxLength || -1
        };
      }
      else {
        each(node.children, function (child) {
          var subBoundaries = getNodeBoundaries(child, initialNode);
          if (subBoundaries.minItems !== -1) {
            if (boundaries.minItems !== -1) {
              boundaries.minItems = Math.max(
                boundaries.minItems,
                subBoundaries.minItems
              );
            }
            else {
              boundaries.minItems = subBoundaries.minItems;
            }
          }
          if (subBoundaries.maxItems !== -1) {
            if (boundaries.maxItems !== -1) {
              boundaries.maxItems = Math.min(
                boundaries.maxItems,
                subBoundaries.maxItems
              );
            }
            else {
              boundaries.maxItems = subBoundaries.maxItems;
            }
          }
        });
      }
      return boundaries;
    };
    return getNodeBoundaries(this);
  };
};
