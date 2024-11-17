import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AlbumArt from './ArtMulti';
import Image from "next/image";


function DraggableDroppable({items, setItems, localhost, token, volumioSocketCmd, onMove, playingNow}) {
	//const [items, setItems] = useState(items);


console.log('items',items)

  
  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
  };
 
  
  const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: "none",
	background: isDragging ? "rgba(40,40,50,0.4)" : "",
	...draggableStyle,
  });
  
  const getListStyle = (isDraggingOver) => ({
	background: isDraggingOver ? "rgba(25,25,30,0.4)" : "",
  });

  const onDragEnd = (result) => {
	if (!result.destination) return;
  
	const { source, destination } = result;
  
	// Call onMove to handle the movement logic
	onMove("moveQueue", {
	  from: source.index,
	  to: destination.index,
	});
  
	// Update local state with the reordered items
	const reorderedItems = reorder(items, source.index, destination.index);
	setItems(reorderedItems);
  };
  
	return (
	  <DragDropContext onDragEnd={onDragEnd}>
		<Droppable droppableId="droppable">
		  {(provided, snapshot) => (
			<div
			  {...provided.droppableProps}
			  ref={provided.innerRef}
			  style={getListStyle(snapshot.isDraggingOver)}
			  className="editable-list "
			>
			  {items && items.length? 
			  items.map((item, index) => (
			
				<Draggable key={item.uri+index} draggableId={item.uri+index} index={index}>
				  {(provided, snapshot) => (
					<div
					  ref={provided.innerRef}
					  {...provided.draggableProps}
					  {...provided.dragHandleProps}
					  style={getItemStyle(
						snapshot.isDragging,
						provided.draggableProps.style
					  )}
					  className={`list-item ${playingNow>index?"played":" unplayed"}   ${playingNow==index?"playing now":""}`}
					>
					   <AlbumArt
                meta={item}
                key={item.uri}
                index={index}
                type="small"
                localhost={localhost}
                token={token}
                volumioSocketCmd={volumioSocketCmd}
              />
              
           
					</div>
				  )}
				</Draggable>
			  )):''
			}
			  {provided.placeholder}
			</div>
		  )}
		</Droppable>
	  </DragDropContext>
	);
}

export default DraggableDroppable

