import React from 'react';

import SearchInput from './SearchInput';
import utils from '../utils';

class Friend extends React.Component {
    constructor(){
        super();
        this.state={
            friend: undefined
        }

        this.submitFriendSearch = this.submitFriendSearch.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
    }

    async submitFriendSearch(friendId){
        let friend = await utils.lookUpFriend(friendId);
        this.setState({ friend: friend });
    }

    sendFriendRequest(friendId){
        utils.addFriend(friendId);
    }
    
    render(){
        let friend = this.state.friend;

        return(
            <div>
                <SearchInput submit={this.submitFriendSearch} />
                { friend &&
                    <div>
                       <img className="profile-picture" alt="friend profile" src={friend.picture}/>
                        <p className="profile-name">{friend.first_name} {friend.last_name}</p>
                        <button type="button" onClick={()=>{this.sendFriendRequest(friend.id)}}>Add Friend</button>
                    </div>
                }
            </div>
        )
    }
	
}

export default Friend;