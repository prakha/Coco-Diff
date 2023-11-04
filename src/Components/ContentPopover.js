import { Button, IconButton } from "@chakra-ui/button";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../App/Constants";
import {
  deleteBkmrkFolderAction,
  removeFromBkmrkAction,
} from "../redux/reducers/bookmarks";
import {
  deleteFolderAction,
  removeFromLibAction,
  removeLibFileAction,
} from "../redux/reducers/library";
import { MoveFolderModal } from "../routes/Contents/MoveFolderModal";
import { MoveToBookmarkModal } from "../routes/Contents/MoveToBookmarkModal";

export const ContentPopover = ({
  data,
  type,
  subject,
  library,
  course,
  bookmark,
  libraryId,
  bookmarkId,
}) => {
  const dispatch = useDispatch();
  const [moveFileModal, toggleMoveFileModal] = useState();
  const [moveToBookmarkModal, toggleMoveToBookmarkModal] = useState();

  const {
    removeFromLibStatus,
    deleteFolderStatus,
    removeFromBkmrkStatus,
    deleteBkmrkFolderStatus,
    removeLibFileStatus,
  } = useSelector((state) => ({
    removeFromLibStatus: state.library.removeFromLibStatus,
    deleteFolderStatus: state.library.deleteFolderStatus,
    removeFromBkmrkStatus: state.bookmark.removeFromBkmrkStatus,
    deleteBkmrkFolderStatus: state.bookmark.deleteBkmrkFolderStatus,
    removeLibFileStatus: state.library.removeLibFileStatus,
  }));

  const addToLibrary = () => {
    toggleMoveFileModal(moveFileModal ? null : { ...data, subject });
  };

  const addToBookmark = () => {
    toggleMoveToBookmarkModal(
      moveToBookmarkModal ? null : { ...data, subject }
    );
  };

  const removeFromLibrary = () => {
    dispatch(removeLibFileAction({ fileId: libraryId || data._id }));
    // let obj = {name:data.name, data:data?.data?._id, subjectId:data.subjectId._id, chapterId:data.chapterId?._id}
    // let folderId = library ? library._id : null

    // obj = _.pickBy(obj)
    // // if(folderId)
    //     dispatch(deleteFolderAction({[type]:obj, folderId, remove:true}))
    // // else
    //     // dispatch(removeFromLibAction({path:type, content:data?.data?._id}))
  };

  const removeFromBookmark = () => {
    dispatch(removeFromBkmrkAction({ fileId: bookmarkId || data._id }));

    // let obj = {name:data.name, data:data?.data?._id, subjectId:data.subjectId._id, chapterId:data.chapterId?._id}
    // let folderId = bookmark.bookmark ? bookmark._id : null

    // obj = _.pickBy(obj)
    // if(folderId)
    //     dispatch(deleteBkmrkFolderAction({[type]:obj, folderId, remove:true}))
    // else
    //     dispatch(removeFromBkmrkAction({path:type, content:data?.data?._id}))
  };

  const moveFile = () => {
    if (library) toggleMoveFileModal(data);
    else if (bookmark) toggleMoveToBookmarkModal(data);
  };
  const [open, setOpen] = useState(false);

  return (
    <>
      <Menu>
        <Tooltip label="more" placement="top">
          <MenuButton
            size="sm"
            p={0}
            border={0}
            as={IconButton}
            onClick={() => {
              setOpen((o) => (o ? false : true));
            }}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
        </Tooltip>
        {open ? (
          <MenuList>
            {/* {library || bookmark ? 
                      <MenuItem onClick={moveFile}>
                          Move File
                      </MenuItem>
                      :
                      null
                  } */}
            {library ? null : bookmark || bookmarkId ? (
              <MenuItem
                onClick={removeFromBookmark}
                isLoading={removeFromBkmrkStatus === STATUS.FETCHING}
              >
                Remove from Bookmark
              </MenuItem>
            ) : (
              <MenuItem onClick={addToBookmark}>Bookmark</MenuItem>
            )}
            {bookmark ? null : library || libraryId ? (
              <MenuItem
                onClick={removeFromLibrary}
                isLoading={removeLibFileStatus === STATUS.FETCHING}
              >
                Remove from Library
              </MenuItem>
            ) : (
              <MenuItem onClick={addToLibrary} borderRadius={0}>
                Add to Library
              </MenuItem>
            )}
          </MenuList>
        ) : null}
      </Menu>
      {moveToBookmarkModal ? (
        <MoveToBookmarkModal
          course={course}
          type={type}
          visible={moveToBookmarkModal}
          file={moveToBookmarkModal}
          closeModal={addToBookmark}
        />
      ) : null}
      {moveFileModal ? (
        <MoveFolderModal
          course={course}
          type={type}
          visible={moveFileModal}
          file={moveFileModal}
          closeModal={addToLibrary}
        />
      ) : null}
    </>
  );
};
