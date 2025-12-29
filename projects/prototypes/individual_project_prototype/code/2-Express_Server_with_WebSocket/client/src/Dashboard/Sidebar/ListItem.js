import React from "react";
import { BsChatLeft } from "react-icons/bs";

const ListItem = (props) => {
  const { title } = props;

  return (
    <div className="list_item" onClick={() => {}}>
      <div className="list_item_icon">
        <BsChatLeft color="white" />
      </div>
      <p className="list_item_text">{title}</p>
    </div>
  );
};

export default ListItem;
