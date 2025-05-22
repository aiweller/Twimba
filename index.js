import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let replyToTweet = false
let replyTweetId=""

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.replytopost){
        handleReplyToPostClick(e.target.dataset.replytopost)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick(replyToTweet, replyTweetId)
    }
    else {
        /* document.getElementById("message").textContent=e.target.dataset.replyToPost */
    }
})

function handleReplyToPostClick(tweetId){ 
    replyToTweet = true
    replyTweetId = tweetId
    document.getElementById("tweet-btn").textContent="Reply"
    const replyRecord=tweetsData.filter(e => e.uuid === tweetId)
    handleTweetBtnClick(replyToTweet, tweetId)
    render(replyRecord)
}
function handleDeleteClick(tweetId){ 
    tweetsData.splice(tweetsData.findIndex(e => e.uuid === tweetId),1)
    render(tweetsData)
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render(tweetsData)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render(tweetsData) 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(reply, uuid){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        if (reply){
            replyToTweet=false
            replyTweetId=""
            document.getElementById("tweet-btn").textContent="Tweet"
            const qryUUID=tweetsData.filter(tweetsData => tweetsData.uuid===uuid)
            qryUUID[0].replies.unshift(
                {
                handle: `@TomCruise ✅`,
                profilePic: `images/tcruise.png`,
                tweetText: tweetInput.value,
            }
            )
            
            

        } else{
            tweetsData.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
            })
        }
    render(tweetsData)
    tweetInput.value = ''
    }

}

function getFeedHtml(data){
    let feedHtml = ``
    
    data.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply ${retweetIconClass}"
                    data-replytopost="${tweet.uuid}"
                    ></i>
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash ${retweetIconClass}"
                    data-delete="${tweet.uuid}"
                    ></i>
                </span>            
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(data){
    document.getElementById('feed').innerHTML = getFeedHtml(data)
}

render(tweetsData)

