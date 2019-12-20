import React, { Fragment } from "react";
import { Button, Icon } from "antd";

import { types, getRoot } from "mobx-state-tree";
import { observer, inject } from "mobx-react";

import { runTemplate } from "../../core/Template";
import { guidGenerator, restoreNewsnapshot } from "../../core/Helpers";
import Registry from "../../core/Registry";

/**
 * Video tag plays a simple video file
 * @example
 * <View>
 *   <Video name="video" value="$video"></Video>
 * </View>
 * @example
 * <!-- Video classification -->
 * <View>
 *   <Video name="video" value="$video"></Video>
 *   <Choices name="ch" toName="video">
 *     <Choice value="Positive"></Choice>
 *     <Choice value="Negative"></Choice>
 *   </Choices>
 * </View>
 * @example
 * @param {string} name of the element
 * @param {string} value of the element
 * @param {string} width widht of the video screen
 * @param {string} height height of the video screen
 * @param {string} hotkey hotkey used to play/pause video
 */

const TagAttrs = types.model({
  name: types.maybeNull(types.string),
  value: types.maybeNull(types.string),
  width: types.optional(types.string, "320"),
  height: types.optional(types.string, "240"),
  hotkey: types.maybeNull(types.string),
});

const Model = types
  .model("VideoModel", {
    id: types.optional(types.identifier, guidGenerator),
    type: "video",
    _value: types.optional(types.string, ""),
  })
  .actions(self => ({
    fromStateJSON(obj, fromModel) {
      if (obj.value.choices) {
        self.completion.names.get(obj.from_name).fromStateJSON(obj);
      }
    },

    updateValue(store) {
      self._value = runTemplate(self.value, store.task.dataObj);
    },

    onHotKey() {
      // return self._ws.playPause();
    },
  }));

const VideoModel = types.compose("VideoModel", TagAttrs, Model);

const HtxVideoView = observer(({ store, item }) => {
  if (!item._value) return null;

  return (
    <div>
      <video width={item.width} height={item.height} controls>
        <source src={item._value} type="video/mp4" />
        "Your browser does not support the video playback."
      </video>
    </div>
  );
});

const HtxVideo = inject("store")(observer(HtxVideoView));

Registry.addTag("video", VideoModel, HtxVideo);

export { VideoModel, HtxVideo };
