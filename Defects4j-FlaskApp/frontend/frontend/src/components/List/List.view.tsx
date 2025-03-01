import ListItemView, { ListItem } from '../ListItem/ListItem.view'

interface ListProps {
    items: ListItem[];
}

function ListView({items} : ListProps) {
  return (
    <div className='flex flex-col gap-1'>
        {items.map((item: ListItem) => {
            return <ListItemView {...item}/>
        })}
    </div>
  )
}

export default ListView