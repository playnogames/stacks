import React from 'react';

import SearchInput from './SearchInput';
import utils from '../utils';

class FriendSearch extends React.Component {
    constructor(){
        super();
        this.state = {}

        this.submitFriendSearch = this.submitFriendSearch.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
    }

    async submitFriendSearch(friendId){
        let result = await utils.searchFriend(friendId);

        if (result.success) {
            this.setState({ 
                friend: result.data,
                error: false 
            });
        } else {
            this.setState({ 
                friend: null,
                error: result.error })
        }
    }

    sendFriendRequest(friendId){
        utils.requestFriend(friendId);
    }
    
    render(){
        let friend = this.state.friend;
        let error = this.state.error;

        return(
            <div>
                <SearchInput submit={this.submitFriendSearch} />
                { friend &&
                    <div>
                       <img className="profile-picture" alt="friend profile" src={friend.picture}/>
                        <p className="profile-name">{friend.firstName} {friend.lastName}</p>
                        <div onClick={()=>{this.sendFriendRequest(friend.friendId)}}>Add Friend</div>
                    </div>
                }

                { error &&
                    <div>{error}</div>
                }
            </div>
        )
    }
	
}

export default FriendSearch;