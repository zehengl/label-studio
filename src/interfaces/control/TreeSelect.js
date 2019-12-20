import React, { Component } from "react";

import { observer } from "mobx-react";
import { types, getRoot } from "mobx-state-tree";

import { guidGenerator } from "../../core/Helpers";
import Registry from "../../core/Registry";
import Tree from "../../core/Tree";
import Types from "../../core/Types";

import { ChoiceModel } from "./Choice";
import { HtxLabels, LabelsModel } from "./Labels";
import { RectangleModel } from "./Rectangle";
import SelectedModelMixin from "../mixins/SelectedModel";

import { Form, Checkbox } from "antd";
import { TreeSelect } from "antd";
const { SHOW_PARENT } = TreeSelect;

/**
 * TreeSelect tag, create a group of treeselect, radio, or checkboxes. Shall
 * be used for a single or multi-class classification.
 * @example
 * <View>
 *   <TreeSelect name="gender" toName="txt-1" choice="single-radio">
 *   </TreeSelect>
 *   <Text name="txt-1" value="John went to see Marry"></Text>
 * </View>
 * @name TreeSelect
 * @param {string} name of the group
 * @param {string} toName name of the elements that you want to label
 * @param {single|single-radio|multiple=} [choice=single] single or multi-class
 * @param {boolean} showInline show items in the same visual line
 */
const TagAttrs = types.model({
  name: types.string,
  toname: types.maybeNull(types.string),
  showinline: types.optional(types.boolean, false),
  choice: types.optional(types.enumeration(["single", "single-radio", "multiple"]), "single"),
});

const Model = types
  .model({
    id: types.optional(types.identifier, guidGenerator),
    pid: types.optional(types.string, guidGenerator),
    type: "treeselect",

    selection: types.array(types.string),
  })
  .actions(self => ({
    onChange(value) {
      self.selection = value;
      self._selection = value;
    },

    afterCreate() {
      self.selection = ["0-0-0"];
      self._selection = ["0-0-0"];
    },
  }));

const Composition = types.compose(LabelsModel, RectangleModel, TagAttrs, Model, SelectedModelMixin);

const TreeSelectModel = types.compose("TreeSelectModel", Composition);

const HtxTreeSelect = observer(({ item }) => {
  const treeData = [
    {
      title: "Category 1",
      value: "0-0",
      key: "0-0",
      children: [
        {
          title: "Subcategory 1.1",
          value: "0-0-0",
          key: "0-0-0",
        },
      ],
    },
    {
      title: "Category 2",
      value: "0-1",
      key: "0-1",
      children: [
        {
          title: "Subcategory 2.1",
          value: "0-1-0",
          key: "0-1-0",
        },
        {
          title: "Subcategory 2.2",
          value: "0-1-1",
          key: "0-1-1",
          children: [
            {
              title: "2.2.1",
              value: "0-1-1-0",
              key: "0-1-1-0",
            },
            {
              title: "2.2.2",
              value: "0-1-1-1",
              key: "0-1-1-1",
            },
          ],
        },
        {
          title: "Subcategory 2.3",
          value: "0-1-2",
          key: "0-1-2",
        },
      ],
    },
  ];

  item.selection.map(s => s === true);

  const tProps = {
    treeData,
    value: item._selection,
    onChange: item.onChange,
    treeCheckable: true,
    multiple: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: "Please select",
    style: {
      width: "100%",
    },
  };
  return <TreeSelect {...tProps} />;
});

Registry.addTag("treeselect", TreeSelectModel, HtxTreeSelect);

export { HtxTreeSelect, TreeSelectModel, TagAttrs };
