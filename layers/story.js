addLayer("storylayer", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best:new Decimal(0),
        storyTimer: 0,
        currentRequirement:0,
        currentColor:"#98f898",
        storycounter: 0,//我寻思我也不会写 1.79e308篇故事//但是没准职能会被points取代//好吧还是有点作用的
    }},

    name: "Story", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S",
    color: "#98f898",                       // The color for this layer, which affects many elements.
    type: "none",//不被重置
    resource: "Stories",
    branches: ["world"],
    row: 4,
    displayRow:0,
    position:3,

    unlocked()  {return hasUpgrade('lab',151)},
    layerShown() { return hasUpgrade('lab',151) },
    shouldNotify(){
        return player.storylayer.storyTimer<layers.storylayer.currentRequirement()&&player.tab!='storylayer'
    },

    infoboxes: {
        story: {
            title() {
                if (player.storylayer.storycounter==0) return "LA-1";
                if (player.storylayer.storycounter==1) return "LA-2";
                if (player.storylayer.storycounter==2) return "LC-1";
                if (player.storylayer.storycounter==3) return "LC-2";
                if (player.storylayer.storycounter==4) return "LA-3";
                if (player.storylayer.storycounter==5) return "LC-3";
                if (player.storylayer.storycounter==6) return "V-1";
                if (player.storylayer.storycounter==7) return "LA-4";
                if (player.storylayer.storycounter==8) return "K-1";
                if (player.storylayer.storycounter==9) return "G-1";
                if (player.storylayer.storycounter==10) return "K-2";
                if (player.storylayer.storycounter==11) return "G-2";
                if (player.storylayer.storycounter==12) return "LA-5";
                return "Stories";
            },
            body() { //insert stories here //这不利于维护
                if (player.storylayer.storycounter==0){
                    let story = "Christmas, a rare holiday. You were preparing for the celebration of your lab\'s first anniversary.<br>Just for the first time and just for only one time, you told yourself. There shouldn\'t be other businesses to bother your research.<br>Snowflakes slowly fell down at dusk, matching the christmas trees far away, just lighted out."
                    if (player[this.layer].storyTimer > 10) {
                        story += "<br><br>After placing the last batch of decoration, you suddenly felt cold. You made up your decision to buy a cup of coffee at the Starbucks nearby. You had been used to drinking coffee for the year just passed by. After all, you know, inspiration may come at any moment."
                        story += "<br>\"Director?\" A voice came to interrupt your thinking. You turned around and found out that was the college girl who were studying for a Ph.D. of Philosophy, who loved digging into occultism."
                        story += "<br>\"Oh, Joana, what\'s up?\" You were used to asking her like this, just as she was used to reporting directly to you just now."
                    };
                    if (player[this.layer].storyTimer > 15){
                        story +="<br>\"Well, the thing is...... Wait a second, I need to organize my words. This idea came to me last night......\" She was hesitating. It wasn't like her, always crisp academic style."
                        story +="<br>\"OK, take your time.\" You had to wait."
                        story +="<br>\"......well, almost ready. But what I want to say is little more. It's not convenient here.\" Another unexpected answer."
                        story +="<br>\"OK, I'm just going to Starbucks for a drink. Why don't you come too?\" You had a kind of premonition. This kind of curiousity may be the same important as the glass fragment you saw at the very beginning, but more fatal."
                    };
                    if (player[this.layer].storyTimer > 20){
                        story +="<br><br>The Starbucks were bustling. You were suprised that you could find two seats here during Christmas holidays."
                        story +="<br>After the waiter bringing coffee and snacks, you asked: \"What's in your mind?\""
                        story +="<br>\"Things are that we have been researching the world fragments pointing to, right?\" Joana began her speaking, speed of voice returning to her usual style, \"I know, you were very satisfied to discover the existence of somebody there two month ago, and so did I.\""
                        story +="<br>\"Yeah, an exciting moment. Unfortunately, we can't publish our findings tp the public yet. There're still lots of things unclear.\""
                        story +="<br>\"And then we begun sociological study of that world, studying cities, studying religions, from books and cultures, from architectural styles, from ordinary people's lifestyle...... One outcome after another, most are unimportant though, but it's a big sum in the results of our laboratory.\""
                        story +="<br>\"And that's why I am preparing for our lab's first anniversary. Isn't that a good thing?\" You became more and more confused."
                    };
                    if (player[this.layer].storyTimer > 30){
                        story +="<br>\"That's what I'm going to say. Good is good, but all those involved in the research were dazzled by the sudden results at the beginning. It suddenly occurred to me that the report of the world advance team did not mention the data of the life detector last night.\""
                        story +="<br>\"Huh? It doesn't matter? We have already seen a society made up by people here, functioning normally.\""
                        story +="<br>\"That's the point, Director. I retrieved the report of the world advance team this morning, and found out that the life detector had not detect life at all!\" Joana almost shouted out, but she obviously  didn't want to shout in public, \"That means...\""
                    };
                    if (player[this.layer].storyTimer > 40) story += "<br>\"Is that mean what we saw in that world is not 'people'?\""
                    if (player[this.layer].storyTimer >= 45)story += "<br><br>The cup of coffee in your hand was still hot, but you felt it was snowing more heavily outside."
                    return story;
                };

                if (player.storylayer.storycounter==1){
                    let story = "You never expected that you would not sleep for days. At least you slept for a while this day."
                    story += "<br>As she mentioned, the result of discovering life forms in that world got nowhere. The life detector had no response, as if dead."
                    story += "<br>By riskily and indirectly asking people there about the concept of life and death, you had to doubt that you found a new form of life---or a new definition of it...... Because they never thought they were dead."

                    if (player[this.layer].storyTimer > 10){
                        story += "<br><br>While to other researchers, it was just an episode caused by negligence. After all, <i>they</i> think, this was nothing more than another achievement of forgetting to consider, and would not affect the following and existing research."
                        story += "<br>Both Joana and you thought that was definitely not the case, however. \"Trust intuition.\" you said, \"Ignorance may be fatal.\""
                    };

                    if (player[this.layer].storyTimer > 15){
                        story += "<br>\"You don't seem to have a good rest recently, director......I'm here for the report on sociological research. We think we could publish this preliminary report after one month of hard work.\" The researcher in charge of sociological research said with concern---or he didn't listened to what you had said. "
                        story += "<br>\"So?\" You wondered what this has to do with the report."
                    };

                    if (player[this.layer].storyTimer > 20){
                        story += "<br>\"Some of the advance team went into the church not long ago. The Archbishop recognized them coming from another world at once, so our team members asked lots of questions about that world. I have to say that It have gained a lot......It's just a pity that we haven't won the chance to meet the High Priest in person.\" He spoke in cadence, as if he were telling a story. Sociologists like to tell stories, no matter they're true or false."
                    };

                    if (player[this.layer].storyTimer > 30){
                        story += "<br><br>\"But I heard from the team members that the High Priest will preside over sacrifices and ceremonies personally , and that are not very rare.\" You wondered still."
                    };
                    if (player[this.layer].storyTimer > 35){
                        story += "<br>\"How can you compare that with meeting her in person? It's once in a lifetime get an opportunity to ask questions directly to god! Just like the God allows you to phone him.\" The more he said, the face of him beamed with more joyful. You didn't know what he was aspiring for. He continued, \"Bad luck though, a ceremony had just ended when the team went into the city, which won't happen again for a while. So in fact we don't know the appearance of the High Priest.\""
                    };
                    if (player[this.layer].storyTimer > 40){
                        story += "<br>\"In other words, do you think your report is incomplete before you meet the 'High Priest' in person?\" Sociologists really like to tell stories, you muttered in your heart."
                        story += "<br>\"Yes, otherwise our report would always be 'preliminary'.\" He didn't seem to get what you really meant."
                    }
                    return story;
                };

                if (player.storylayer.storycounter==2){
                    let story = "She woke up again from the room at the top of the church. A new day began, one more time.";
                    story += "<br>But was there any difference between the new day and the old day? Except occasional few days, the Archbishop came to remind about the ceremony---But so what, it was just a part of the eternity. Time is the product of eternity, flowing like water, and herself is the eternity."
                    story += "<br>She simply managed herself in bed. She didn't know why she did it every day---Why needed to know? She didn't need to know the troubles of the world, she didn't need to know the feelings of mortals---She didn't even need to know yesterday and tomorrow."
                    
                    if (player[this.layer].storyTimer > 10){
                        story +="<br><br>There was a steady knock on the door. It was the Archbishop. \"Please come in.\" She said, as always."
                    }

                    if (player[this.layer].storyTimer > 12){
                        story += "<br>The Archbishop pushed the door, following him was a stranger."
                    }

                    if (player[this.layer].storyTimer > 15){
                        story += "<br>\"My High Priest, here's a non-native coming and requesting an interview in person. He is not resident from Pure White City, even......\" The Archbishop paused, \"even not from our world.\""
                    }

                    if (player[this.layer].storyTimer > 20){
                        story += "<br>\"Ah, that's not a big deal. He must be here, coming to see me to understand the world. No need to doubt, it doesn't surprise me.\" She replyed the Archbishop in her typical tone still---A solemn but not superior tone, \"You can do your own business first.\""
                        story += "<br>\"Yes. I'll back after your talk is over.\" And then, the Archbishop went out."
                        story += "<br><br>There were only her and the non-native in the room."
                    }

                    if (player[this.layer].storyTimer > 25){
                        story += "<br>A little surprise to her, the stranger spoke first before her:"
                        story += "<br>\"Sorry to bother you, High Priest, but we know few about this world.\" He was not deterred by majesty. Indeed, not a man in this world."
                    }

                    if (player[this.layer].storyTimer > 30){
                        story += "<br>\"I will answer what I could answer. Just ask.\""
                        story += "<br>The non-native took a board out of his clothes quickly. It looked like a clipboard. He must be prepared in advance."
                        story += "<br>He asked a lot about this world, of course including questions about the Pure White City. She answered, one by one---Naturally, she had known these things from the beginning of her existence. As for when she began to exist in this world, she didn't know."
                    }

                    if (player[this.layer].storyTimer > 40){
                        story +="<br><br>\"OK, I really benefit a lot from the conversation. Before I leave, I'd like to ask one last question.\" The stranger put back his clipboard, \"Is the position of the High Priest......eternal? If not, how does it designate a successor?\""
                        story +="<br>\"The position of the High Priest......\" She paused."
                    }
                    
                    if (player[this.layer].storyTimer > 50){
                        story +="<br>Was existence eternal? It was certain that she existed since the beginning of the world. The High Priest build the Pure White City, as the extension of her power. It was she who makd the people live and work in peace and contentment, and she who bathed the world in light and glory......"
                    }

                    if (player[this.layer].storyTimer > 55){
                        story += "<br>......?"
                    }

                    if (player[this.layer].storyTimer > 60){
                        story += "<br>\"High Priest?\" The non-native asked again."
                        story += "<br>\"Ah, yes. The position of the High Priest is eternal.\" At this moment did she recover from thinking."
                        story += "<br>\"Alright, express my thanks again. It's a honour to talk to you.\" The stranger got up and saluted to leave. The Archbishop went in, taking him out of the door."
                    }

                    if (player[this.layer].storyTimer > 65){
                        story += "<br><br>Now only herself alone, in her room high above. The sun had hung high in the gray sky."
                    }

                    if (player[this.layer].storyTimer > 70){
                        story += "<br>\"Is that......true?\""
                    }

                    return story;
                };

                if (player.storylayer.storycounter==3){
                    let story = "She woke up again from the room at the top of the church. A new day began, one more time.";

                    if (player[this.layer].storyTimer > 10) story += "<br>One more time."
                    if (player[this.layer].storyTimer > 13) story += "<br>She was still thinking about the impact of the questions had asked by that non-native yesterday."
                    if (player[this.layer].storyTimer > 16) story += "<br>Wait, \"<i>Yesterday</i>\"?"

                    if (player[this.layer].storyTimer > 20){
                        story += "<br><br>She felt that she knew the meaning of the word \"Yesterday\" vaguely. She was just not using that word for a long time."
                        story += "<br>\"Yesterday\" meant the day had already passed. The concept opposite to it was \"Tomorrow\", the day hadn't come yet."
                        story += "<br>Why could she remember \"Yesterday\"? It seemed to be......different from her and eternity."
                    }

                    if (player[this.layer].storyTimer > 30){
                        story += "<br><br>So, what's the \"Yesterday\" of a \"Yesterday\"? It must be a day, in which lots of things could happen. What's the \"Tomorrow\" of a \"Tomorrow\"? It is a day too, in which also could happen lots of things."
                        story += "<br>Every \"Day\" could be remembered, just like she remembered \"Yesterday\"."
                        story += "<br>The eternity is not eternal anymore. More colours appeared in a monotonous colour."
                    }

                    if (player[this.layer].storyTimer > 40){
                        story += "<br><br>She was in a blur of colours, surrounded by nothing else. Only colours---Dazzling, blurred colours---Constantly changing, filling the space in front of her."
                        story += "<br>She wanted to use her divine power to break the illusion, but she couldn't."
                    }

                    if (player[this.layer].storyTimer > 45){
                        story += "<br>The light of colours became more dazzling. Different colours of light blended together to form the ultimate white, oppressing her."
                        story += "<br>She wanted to shout, she wanted to call out, but she was forced to be silent, as if a hand had caught her throat."
                        story += "<br>She could only stay where she was and watch the white light oppress herself and everything."
                    }

                    if (player[this.layer].storyTimer > 50) story += "<br><br>......"
                    if (player[this.layer].storyTimer > 60) story += "<br><br>......"

                    if (player[this.layer].storyTimer > 70) story += "<br><br>She woke up again from the room at the top of the church. One more time."
                    if (player[this.layer].storyTimer > 75) story += "<br>She suddenly realized that this was definitely not the first time she had experienced this feeling."

                    return story;
                };

                if (player.storylayer.storycounter==4){
                    let story = "You felt dizzy when you came out of the meeting room.";
                    story += "<br>There was no doubt, your preliminary report of your research caused a shock in the scientific circle."

                    if (player[this.layer].storyTimer > 5)story += "<br>But to your surprise, you were not the only one who were researching 'other worlds'. Long before you, there had been lots of scientists studying this field. Some liked you began his research from a concrete world, while theorists started with a larger aspect, trying to verify the feasibility and existence of 'other worlds'---Or 'parallel worlds'---in theory."
                    if (player[this.layer].storyTimer > 10)story += "<br>And, to be honest, for you, it was very tiring to watch the two factions quarreling at the meeting."

                    if (player[this.layer].storyTimer > 15){
                        story += "<br><br>You sat on a bench outside the meeting room, trying to restore spirit."
                        story += "<br>\"Hey, young man, this meeting didn't kill you huh?\" An elder's voice sounded."
                    }

                    if (player[this.layer].storyTimer > 18){
                        story += "<br>You looked up at him. He was one of the hosts of the meeting, a big man in this area. His appearance and eyes---And his mop-like hair---were showing the identity of a wise man."
                    }

                    if (player[this.layer].storyTimer > 21)story += "<br>\"Nope, senior, I'm fine......\" You tired to be polite and humble, but you couldn't be against tireness."

                    if (player[this.layer].storyTimer > 24)story += "<br>\"We could thank god if this kind of meetings didn't exhaust us to death.\" He made a disgusting gesture and sat next to you. \"Your report did impress me, but as other rookies, you focus too much on specific aspects.\""

                    if (player[this.layer].storyTimer > 27)story += "<br>\"Ah, so......What problem could it cause?\" You humbly asked him for advice."

                    if (player[this.layer].storyTimer > 30)story += "<br>\"I cannot tell you specify what problems this will bring, but I saw them before......\" He lit a cigar, \"Felling in love with a guy from 'other worlds'? I can't count by my ten fingers. What's more there were those who interfere in the internal affairs of other countries, as if international law did not exist between different worlds---It does not exist, in the view of jurisprudence logics, somehow......\""

                    if (player[this.layer].storyTimer > 35)story += "<br>You couldn't help being amused by his humor. \"So, how do I avoid this?\""

                    if (player[this.layer].storyTimer > 38)story += "<br>\"Well, youngster.\" He took a puff of smoke, \"Even if I've been in this business for more than 30 years, I cannot tell what you should do. But I can tell you what you shouldn't do:"

                    if (player[this.layer].storyTimer > 45)story += "<br><br>\"Never think you're somebody, and could do something to the different world."

                    if (player[this.layer].storyTimer > 50)story += "<br>\"Never forget what you are researching for. It's for us, Homo sapiens on the Earth in the Solar System in the Galactic System in the Grand Universe, us."

                    if (player[this.layer].storyTimer > 55)story += "<br>\"Don't dwell too much on specific aspects. A normal guy's life is not worth following for a lifetime, that's what sociologists do. Keep your eyes on bigger aspects, like the birth of the world, the composition of the world, and so on.\""

                    if (player[this.layer].storyTimer > 60)story += "<br>You nodded frequently and vowed to remember everything the elder said."

                    if (player[this.layer].storyTimer > 63)story += "<br>\"Oh, by the way, it's a pity that your laboratory is in England. You could receive research funding from the state directly if you move your lab to Japan.\" He didn't forget to remind you at last. You knew you wouldn't move, but you thanked to him though."

                    return story;
                };

                if (player.storylayer.storycounter==5){
                    let story = "She couldn't remember when she was relieved to the identity of \"the High Priest\", but she could make sure that her state of non desire was related to it.";
                    story += "<br>When she tried to remind about her past hardly, she could remind nothing. Not that kind of \"forgotten\" 'cause of long time, but a blank."
                    story += "<br>When she told the Archbishop this doubt and feeling, the Archbishop thought for a while and pointed out: \"This memory loss is probably man-made.\""

                    if (player[this.layer].storyTimer > 10){
                        story += "<br><br>Man-made, who can wipe out the High Priest's memory? Who <b>has</b> the ability to wipe out a <b>god</b>'s memory? "
                        story += "<br>She began to turn her thinking direction here. The Archbishop also had a kind of divine power, but he had no possibility of direct confrontation with the High Priest."
                    }

                    if (player[this.layer].storyTimer > 20) story += "<br>So, who? Who?"
                    if (player[this.layer].storyTimer > 25) story += "<br>This question lingered in her mind like a shadow. \"You don't have to worry too much about this problem.\" She constantly advised herself not to fall into paranoia and persistence, but it was useless."

                    if (player[this.layer].storyTimer > 35){
                        story += "<br><br>She thought about this problem, day and night. However, the isolated god had no concept of others in the world, so she could not any possible suspect."
                        story += "<br>When she used to sleep, she always meditated, bathing her consciousness in lights. But now, when she brought her consciousness into the lights, she could fell the shadow fluttering around her."
                    }

                    if (player[this.layer].storyTimer > 40){
                        story += "<br>She tried to drive away the shadow desperately, \"That's impure!\" She ran. She shout. If somebody outside heard, he would be surprised that the High Priest had been having a nightmare and woke her up."
                    }
                    if (player[this.layer].storyTimer > 45) story += "<br>But no one dares to interfere in the affairs of the god."

                    if (player[this.layer].storyTimer > 55){
                        story += "<br><br>She sat up from her bed. It was still dark outside the window."
                        story += "<br>She was annoyed with her gaffe, although no one saw it."
                        story += "<br>That shadow must have appeared because she was too paranoid. Just forget that question, forget everything, and that shadow will disappear......"
                    }

                    if (player[this.layer].storyTimer > 65)story += "<br><br>......Wait, no......that <i>shadow</i>......"

                    return story;
                };

                if (player.storylayer.storycounter==6){
                    let story = "The Archbishop was not surprised by her arrival. In fact, when the High Priest asked that question, he knew that the question could only be dealt by the girl in front of her.";
                    if (player[this.layer].storyTimer > 5){
                        story +="<br><br>It was too far fetched to call this one \"a girl\". The Archbishop knew, in fact, the girl in front of her, same as the High Priest, are both the embodiments of the character of the world. In the eyes of mortals, embodiments' abilities were like gods. Although the Archbishop had high power and had extraordinary longevity and magic ability, he still came from mortals, and would become mortal after the successor was appointed, and died."
                    };

                    if (player[this.layer].storyTimer > 10){
                        story +="<br>\"I can take you to her if I'm present for your conversation.\" He made a majestic gesture, which he seldom did."
                        story +="\"That's fine. I think---\" A shadow of a smile touched the girl's mouth, \"you want to know the reasons of it, too.\""
                    }
                    if (player[this.layer].storyTimer > 15){
                        story +="<br>\"Nope. I know all of the reasons. It's clearly written in the book.\" The Archbishop despised it. It seemed that the girl underestimated his erudition. \"I just want to know what you bring this time and make sure this meeting won't collapse the church.\""
                        story +="<br>\"Hah, that can't happen. You think too highly of me.\" She gave a laugh, \"Lead the way.\""
                    }

                    if (player[this.layer].storyTimer > 25){
                        story += "<br><br>There was a steady knock on the door. It was the Archbishop. \"Please come in.\" The High Priest said."
                    }

                    if (player[this.layer].storyTimer > 28){
                        story += "<br>\"Hope that you are well, my High Priest......\" The Archbishop came in, \"......Today I bring someone......who is your friend.\""
                    }

                    if (player[this.layer].storyTimer > 31)story += "<br>\"Friend?\" The high priest was slightly stunned."
                    if (player[this.layer].storyTimer > 33)story += "<br>\"That's true. You can't remember, because she belongs to your missing memory.\" The Archbishop explained,"
                    if (player[this.layer].storyTimer > 36)story += "\"I want to stay aside in the next conversation if possible.\""
                    if (player[this.layer].storyTimer > 40)story += "<br>\"......You can.\" The High Priest answered, looking at the so-called \"her friend\" brought by the Archbishop: Black hair, black dress, and a black umbrella in her hand."
                    if (player[this.layer].storyTimer > 45)story += "<br>She could make sure, She didn't know this \"friend\"."

                    if (player[this.layer].storyTimer > 55)story += "<br><br>\"Why do you come to see me?\" The High Priest asked with no interest. The girl's eyes were aggressive and annoying, she thought."
                    if (player[this.layer].storyTimer > 58)story +="<br>\"I come to find you, 'cause I found the thing which could recover your memory.\" The girl with black hair gave a wee smile and took a fragment from behind."
                    if (player[this.layer].storyTimer > 63)story +="<br>This fragment, was not pure like the High Priest had saw before. It was lackluster, emitting a dark red glow."
                    if (player[this.layer].storyTimer > 66)story +="<br>\"......That is it?\" The High Priest asked disdainfully, failed to notice that the Archbishop's breath had already been rapid."

                    if (player[this.layer].storyTimer > 72)story +="<br><br>\"My High Priest, what this fragment contains......is yourself, is the part of memory you deliberately got rid of.\" The Archbishop hurried into the two side of this conversation. "
                    if (player[this.layer].storyTimer > 75)story +="\"It could explain your memory loss problem, but, I think you should use it from <b>ANY</b> reason. Because......It gives me a premonition of pain.\""
                    if (player[this.layer].storyTimer > 80)story +="<br>\"What?\" The High Priest was obviously stunned by the Archbishop's words, but soon her attention was attracted by the black haired girl's laughter."
                    if (player[this.layer].storyTimer > 85)story +="<br>\"Hahaha......You really don't remember anything. Is your memory so completely abandoned?\" Her tone became more and more aggressive, but somehow it had a kind of temptation."
                    if (player[this.layer].storyTimer > 90)story +="<br>The High Priest knew this sound."
                    if (player[this.layer].storyTimer > 95)story +="<br>She didn't know this \"friend\", but she knew this sound."

                    if (player[this.layer].storyTimer > 105)story += "<br><br>\"Give it to me.\" The High Priese said to that girl."
                    if (player[this.layer].storyTimer > 108)story += "<br>\"What are you doing, my High Priest?!\" The Archbishop still tried to dissuade."
                    if (player[this.layer].storyTimer > 111)story += "<br>\"Give that fragment to me, no matter what.\""
                    if (player[this.layer].storyTimer > 114)story += "<br>Only then did the Archbishop forcibly withdraw his hand and slowly step away from the two sides of the meeting."
                    if (player[this.layer].storyTimer > 120)story += "<br>\"Take it, you will remember who you are, really.\" The black hair girl said. Her tone was not that aggressive."
                    if (player[this.layer].storyTimer > 125)story += "<br>The High Priest extended his hand, stumbled briefly, and took that bloody fragment."

                    if (player[this.layer].storyTimer > 130)story +="<br>";
                    if (player[this.layer].storyTimer > 135)story +="<br>";
                    if (player[this.layer].storyTimer > 140)story +="<br>";

                    if (player[this.layer].storyTimer > 145)story +="<br>It all happened very suddenly, but the Archbishop was sure that it was not a scene he would like to see. At least for now, it was worse than the collapse of the church."
                    if (player[this.layer].storyTimer > 150)story +="<br>\"My High Priest......\" He wanted to speak, but he couldn't."
                    if (player[this.layer].storyTimer > 155)story +="<br>He couldn't blame the black haired girl. When she took out that fragment---no, when she appeared in front of him, all this was doomed."
                    if (player[this.layer].storyTimer > 160)story +="<br>That \"her\", had come back. He could not stop this even if he wanted. Although he persuaded himself not to stop, but......"
                    if (player[this.layer].storyTimer > 165)story +="<br>\"The High Priest\", no, that \"Her\", knelt down on the ground, crying."
                    if (player[this.layer].storyTimer > 170)story +="<br>\"Hahahahaha......\" That girl's laughter, again, \"In the countless of world cycles, you and I had fought for thousands of times. You beat me every time, but that's because I don't think it was a fair fight. So I lost, every time."
                    if (player[this.layer].storyTimer > 180)story +="<br>\"You never thought about how I felt, because you have never really experienced the world. You have never carefully observe the memories corresponding to the fragments you collected. You couldn't bear them, every time, and lost yourself at last, gain power from fragements."
                    if (player[this.layer].storyTimer > 190)story +="<br>\"I really enjoyed my time with you, before you collected those fragements, before you lost yourself.\" She bent down, lifting the High Priest---No, \"her\"--- face gently with her hand, \"You were a very interesting and kind girl, that time.\""
                    if (player[this.layer].storyTimer > 195)story +="<br>"
                    if (player[this.layer].storyTimer > 200)story +="<br>\"Welcom back, 「Hikari」.\""

                    return story;
                };

                if (player.storylayer.storycounter==7){
                    let story = "Somebody knocked your door, \"Please come in.\" You said.";
                    if (player[this.layer].storyTimer > 5) story += "<br>The door opened, it was the leader of world advance team. After the success of \"Pure White Action\", you specially approved the world advance team for half a month's vacation. Today was his first work day after vacation. \"What's up?\" You asked."
                    if (player[this.layer].storyTimer > 10) story += "<br>\"Things are that I think it's time for our world advance team continuing to explore the world.\" The team leader said, \"The Pure White City, wonderful though, shouldn't be our end.\""
                    if (player[this.layer].storyTimer > 15) story += "<br>\"Oh? That's true. Do you have any idea?\" You asked."
                    if (player[this.layer].storyTimer > 18) story += "<br>\"I think we should think further. Our goal should be the end of the world.\" He patted his chest with pride."

                    if (player[this.layer].storyTimer > 25) story += "<br><br>You broke out a laughter, \"This step is too far, huh?\""
                    if (player[this.layer].storyTimer > 28) story += "<br>\"Nope. According to the investigation about the world view of the residents of Pure White City, many people there don't know if there were cities outside their city. A few scholars have given a positive answer though, but they don't know the exact position.\" He seemed very confident in his ideas, \"We can roughly determine several directions based on the map we found in city library.\""
                    if (player[this.layer].storyTimer > 35) story += "<br>\"But your previous report have shown that the mainstream view is that only Pure White City is inhabited?\" You were still persuading him to give up the idea."
                    if (player[this.layer].storyTimer > 40) story += "<br>\"How could you know without going to see it?\" His confidence still."

                    if (player[this.layer].storyTimer > 45) story += "<br><br>Yes, don't dwell too much on specific aspects.  \"So I'll arrange people who will stay at Pure White City. Write a preliminary plan on paper today. If convenient, speak your plan to me briefly.\""
                    if (player[this.layer].storyTimer > 50) story += "<br>\"Alright. According to the destination and terrain, I think there are two suspicious spots we could approach easily. One in the west of Pure White City, another in the south-east.\" He said. \"Both of them are not far away from the city. If we take some days to prepare,  exploration report will be on your desk in at most two weeks.\""

                    if (player[this.layer].storyTimer > 60) story += "<br>\"OK, let's do this.\" You approved his plan, like making a new risky move in chess."
                    return story;
                };

                if (player.storylayer.storycounter==8){
                    let story = "To her, everyday was a grand banquet.";
                    story += "<br>A banquet without guests."

                    if (player[this.layer].storyTimer > 5) {
                        story += "<br><br>She built this architecture in strict accordance with her own experience and memories: A exquisite Western style manor."
                        story += "<br>If someone arrived, he must have been impressed by the exquisite layout and decoration."
                }

                if (player[this.layer].storyTimer > 10){
                    story += "<br>But, no one had arrived."
                    story += "<br>And, no one would arrive."
                }

                if (player[this.layer].storyTimer > 20){
                    story += "<br><br>After finding out that she didn't need to eat like people in fragments' memories, she devoted all her energy to piecing together and visiting memories. She saw I lot. She felt bored."
                    story += "<br>Wandering in her own manor, is remembering her first time in the world, is remembering her first memory."
                }

                if (player[this.layer].storyTimer > 25){
                    story += "<br><br>But what she didn't know is today would be different."
                    story += "<br>In fact, she didn't know what this difference could bring."
                    story += "<br>Even if she had knew, she would not be scared, though."
                }

                if (player[this.layer].storyTimer > 35)story += "<br><br>\"There seems to be something......in the hall.\" She muttered to herself and hid carefully behind the wall in the corridor."
                if (player[this.layer].storyTimer > 38)story += "<br>Somebody here. Looked like not guests."
                if (player[this.layer].storyTimer > 41)story += "<br>\"Be cautious. Don't touch any suspicious things. Photo every thing we want to know.\" Said the leading man, commanding the others."
                if (player[this.layer].storyTimer > 46)story += "<br>What in their hands......seemed to have more than just cameras."
                if (player[this.layer].storyTimer > 50)story += "<br>She went back to kitchen, picked up the bread knife she knew."
                if (player[this.layer].storyTimer > 53)story += "<br>From her eyes, she didn't know what these men wanted to do, just as she wouldn't know the whole memory in the beginning."
                if (player[this.layer].storyTimer > 58)story += "<br>She was just doing what she knows."
                if (player[this.layer].storyTimer > 61)story += "<br>Go around outside the hall and behind them, reasonable."

                if (player[this.layer].storyTimer > 70){
                    story += "<br><br>With a quick throw, the bread knife flew out of her hand and ran directly to the throat of the leading man."
                    story += "<br>But then came the sound of violent metal collision. The knife was blocked by the shield. It fell to the ground and made a crisp noise."
                }

                    return story;
                };

                if (player.storylayer.storycounter==9){
                    let story = "Story in Plan, haven't been written/translated.";
                    return story;
                };

                if (player.storylayer.storycounter==10){
                    let story = "\"And that's all. I think that's all I can tell you.\" The girl said on the alert to the team leader.";
                    if (player[this.layer].storyTimer > 5) story += "<br>\"Thank you very much. We don't mean to offend. Your answer is very important for us to understand the world.\" The leader replied, turned around and prepared to let the team return to the camp."
                    if (player[this.layer].storyTimer > 10) story +="<br>\"Hey, hey, leader, how can we just leave?\" A voice sounded."
                    if (player[this.layer].storyTimer > 13) story +="<br>The leader took a look. It was the team scientist, the annoying guy."
                    if (player[this.layer].storyTimer > 16) story +="<br>\"What else do you want to ask? We can't disturb others.\" The leader's words implied an order."

                    if (player[this.layer].storyTimer > 20) story +="<br><br>\"So, that, miss,\" The scientist asked. \"You have mentioned that your main life is to explore and experience......memories in fragments? How could you make it? We only have the ability to judge whether they have energy.\""
                    if (player[this.layer].storyTimer > 30) story +="<br>That girl answered with a smile, \"Hah, only this question? Easy for me, you just need to step into the memory. Maybe you will become somebody in the memory, but that's fine for me......Maybe I can show them to you and you could see those memories.\""
                    if (player[this.layer].storyTimer > 40) story +="<br>\"That's great!\" The scientist lighted up with pleasure. The leader shook his head slightly. Seems that the whole team needs to be silly with this \"mad guy\" again."

                    if (player[this.layer].storyTimer > 45) story +="<br><br>The girl led the group in front of a door. It was a big gate. Obviously, the room behind it couldn't be small. Maybe another hall."
                    if (player[this.layer].storyTimer > 47) story +="<br>She pushed the door slightly. What in front of their eyes was a florescent cloud, made by fragments, floating in the hall."
                    if (player[this.layer].storyTimer > 50) story +="<br>No one didn't show surprise, but all soldiers were trained to be silent."
                    if (player[this.layer].storyTimer > 53) story +="<br>Except the scientisit."

                    if (player[this.layer].storyTimer > 60) story += "<br>\"Wow, so many fragments 'alive' here......I think there must be more than one memory in these fragments. How could you pick up what you want to see among them?\""
                    if (player[this.layer].storyTimer > 65) story += "<br>\"It's not hard. You could see parts of memories through fragments. The whole memory will be shown once you step in.\""
                    if (player[this.layer].storyTimer > 70) story += "<br>She stopped for a while, and reached her hand to the scientisit."
                    if (player[this.layer].storyTimer > 73) story += "<br>\"I'm afraid you don't know how first time.\" She explained."
                    if (player[this.layer].storyTimer > 76) story += "<br>\"OK, OK, It's for science!\" To her surprise, the scientist held her hand directly and tightly, without any hesitation."
                    if (player[this.layer].storyTimer > 80) story += "<br>\"That's fine. Let's go.\" She turned her head and extended her other hand to the nearest fragment."

                    if (player[this.layer].storyTimer > 90) story += "<br><br>Scientists watched the girl's fingers gradually turn into fragments, flying towards the direction she had pointed before. The fragments of her had a blue-green fluorescence, beautiful."
                    if (player[this.layer].storyTimer > 95) story += "<br>First the fingers, then the hands, and finally the whole arm and body, she became the thing she had wanted to get in."
                    if (player[this.layer].storyTimer > 100) story += "<br>The fragments she had turned to had no no wire connection between each other, but others could see that this was a whole. The green fragments moved into a cloud of fragments, flickering."
                    if (player[this.layer].storyTimer > 105) story += "<br>No one didn't show surprise, but all soldiers were trained to be silent."
                    if (player[this.layer].storyTimer > 108) story += "<br>Except the scientisit."

                    if (player[this.layer].storyTimer > 115) story += "<br>\"Wow......This......This is so <i>fascinating</i>!\""

                    return story;
                };

                if (player.storylayer.storycounter==11){
                    let story = "Story in Plan, haven't been written/translated.";
                    return story;
                };

                if (player.storylayer.storycounter==12){
                    let story = "Story in Plan, haven't been written/translated.";
                    return story;
                };

                if (player.storylayer.storycounter>=player.storylayer.points.toNumber()){
                    return "You have read all existing stories!"
                }
                
            },
        unlocked(){return hasUpgrade('lab',151)},
        titleStyle(){return {'background-color':layers.storylayer.currentColor()} },
        bodyStyle: {'text-align':'left'},
        },
    },

    update(diff){
        if (!player[this.layer].unlocked) player[this.layer].storyTimer = 0;
        else if(player[this.layer].storyTimer<layers.storylayer.currentRequirement()&&player.tab=='storylayer') player[this.layer].storyTimer += diff;
    },

    doReset(resettingLayer){},

    currentRequirement(){//use layers
        let req = 0;
        //在这里插入每个故事走到头要多长时间
        if (player.storylayer.storycounter==0) req = 60;
        if (player.storylayer.storycounter==1) req = 60;
        if (player.storylayer.storycounter==2) req = 75;
        if (player.storylayer.storycounter==3) req = 90;
        if (player.storylayer.storycounter==4) req = 75;
        if (player.storylayer.storycounter==5) req = 75;
        if (player.storylayer.storycounter==6) req = 210;
        if (player.storylayer.storycounter==7) req = 75;
        if (player.storylayer.storycounter==8) req = 75;
        if (player.storylayer.storycounter==9) req = 60;
        if (player.storylayer.storycounter==10) req = 135;
        if (player.storylayer.storycounter==11) req = 60;
        if (player.storylayer.storycounter==12) req = 60;
        return req;
    },

    currentColor(){
        let color = "#98f898";
        if (player.storylayer.storycounter==0) color = "#00bdf9";
        if (player.storylayer.storycounter==1) color = "#00bdf9";
        if (player.storylayer.storycounter==2) color = "#ffe6f6";
        if (player.storylayer.storycounter==3) color = "#ffe6f6";
        if (player.storylayer.storycounter==4) color = "#00bdf9";
        if (player.storylayer.storycounter==5) color = "#ffe6f6";
        if (player.storylayer.storycounter==6) color = "#f1d4c4";
        if (player.storylayer.storycounter==7) color = "#00bdf9";
        if (player.storylayer.storycounter==8) color = "#16a951";
        if (player.storylayer.storycounter==9) color = "#d7a9f4";
        if (player.storylayer.storycounter==10) color = "#16a951";
        if (player.storylayer.storycounter==11) color = "#d7a9f4";
        if (player.storylayer.storycounter==12) color = "#00bdf9";
        return color;
    },

    tabFormat: [
        "blank", 
        "clickables",
        ["infobox","story",{'border-color':function(){return layers.storylayer.currentColor()}}],
        ["bar","storybar"],
        "upgrades",
    ],

    bars: {
        storybar: {
            direction: RIGHT,
            width: 500,
            height: 10,
            progress() { return player.storylayer.storyTimer/(layers.storylayer.currentRequirement()) },
            barcolor() {
                return layers.storylayer.currentColor();
            },
            fillStyle(){return {'background-color':layers[this.layer].bars.storybar.barcolor()}},
        },
    },

    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "",
            display: "←",
            unlocked() { return player.storylayer.unlocked },
            canClick() { return player.storylayer.storycounter>0 },
            onClick() { 
                player.storylayer.storycounter -= 1;
                player.storylayer.storyTimer  = layers.storylayer.currentRequirement();
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        12: {
            title: "",
            display: "→",
            unlocked() { return player.storylayer.unlocked },
            canClick() { return player.storylayer.points.gt(player.storylayer.storycounter) },
            onClick() { 
                player.storylayer.storycounter += 1;
                if(player.storylayer.points.eq(player.storylayer.storycounter))  player.storylayer.storyTimer = 0;
                else player.storylayer.storyTimer  = layers.storylayer.currentRequirement();
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
    },

    upgrades: {
        11:{ title: "Restart World Research",
        fullDisplay(){
            return "<b>Restart World Research</b><br>The speed of World Step gain in Restriction Challenge now <b>based on</b> your Fragments instead of <b>determined by</b> your Fragments.<br><br>Cost:750 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==0&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(750)},
        pay(){
            player.world.points = player.world.points.sub(750);
        },
        unlocked() { return (player.storylayer.storycounter==0&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',11)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        12:{ title: "Bouquet",
        fullDisplay(){
            return "<b>Bouquet</b><br>Glowing Roses now boosts your Fragments generation and Memories gain.<br><br>Cost:2,500 Glowing Roses"
        },
        canAfford(){return player.storylayer.storycounter==1&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.rei.roses.gte(2500)},
        pay(){
            player.rei.roses = player.rei.roses.sub(2500);
        },
        unlocked() { return (player.storylayer.storycounter==1&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',12)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        effect(){
            let eff = new Decimal(1);
            if (hasUpgrade('storylayer',12)) eff = player.rei.roses.plus(1).log(8).times(2).max(1);
            if (hasAchievement('a',93)) eff = eff.times(tmp.etoluna.starPointeffect);
            eff=eff.times(challengeEffect('saya',41));
            return eff;
        },
        },
        13:{ title: "World-View Adjustment",
        fullDisplay(){
            return "<b>World-View Adjustment</b><br>The speed of Random&Fixed World Steps will be set to max.<br><br>Cost:900 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==2&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(900)},
        pay(){
            player.world.points = player.world.points.sub(900);
        },
        unlocked() { return (player.storylayer.storycounter==2&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',13)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        14:{ title: "Spiral Steps",
        fullDisplay(){
            return "<b>Spiral Steps</b><br>You Endure Restriction Challenge automatically and you no longer endure its negative buff.<br><br>Cost:900 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==3&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(900)},
        pay(){
            player.world.points = player.world.points.sub(900);
        },
        unlocked() { return (player.storylayer.storycounter==3&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',14)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        15:{ title: "Wide Known",
        fullDisplay(){
            return "<b>Wide Known</b><br>You can choose all four directions at one move, and move in maze is now automated.<br><br>Cost:9 Flourish Labyrinths<br>Req:Achievement 'Higher And Higher'"
        },
        canAfford(){return player.storylayer.storycounter==4&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.yugamu.points.gte(9)&&hasAchievement('a',91)},
        pay(){
            player.yugamu.points = player.yugamu.points.sub(9);
        },
        unlocked() { return (player.storylayer.storycounter==4&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',15)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        21:{ title: "Re-Pick The Past",
        fullDisplay(){
            return "<b>Re-Pick The Past</b><br>Glowing Roses now boosts Light Tachyons&Dark Matters gain.<br><br>Cost:75,000 Glowing Roses"
        },
        canAfford(){return player.storylayer.storycounter==5&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.rei.roses.gte(75000)},
        pay(){
            player.rei.roses = player.rei.roses.sub(75000);
        },
        unlocked() { return (player.storylayer.storycounter==5&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',21)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        effect(){
            let eff = new Decimal(1);
            if (hasUpgrade('storylayer',21)) eff = player.rei.roses.plus(1).log(5).times(1.5).max(1);
            if (hasAchievement('a',93)) eff = eff.times(tmp.etoluna.starPointeffect);
            eff = eff.times(challengeEffect('saya',41));
            return eff;
        }
        },
        22:{ title: "Regain The Power",
        fullDisplay(){
            return "<b>Regain The Power</b><br>LC itself boosts L's gain, and FL itself boosts D's gain<br><br>Cost:11 Luminous Churches<br>11 Flourish Labyrinths"
        },
        canAfford(){return player.storylayer.storycounter==6&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.rei.points.gte(11)&&player.yugamu.points.gte(11)},
        pay(){
            player.rei.points = player.rei.points.sub(11);
            player.yugamu.points = player.yugamu.points.sub(11);
        },
        unlocked() { return (player.storylayer.storycounter==6&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',22)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        23:{ title: "Exploration",
        fullDisplay(){
            return "<b>Exploration</b><br>Explore to the end of the world.<br><br>Cost:60,000,000 Research Points"
        },
        canAfford(){return player.storylayer.storycounter==7&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.lab.points.gte(60000000)},
        pay(){
            player.lab.points = player.lab.points.sub(60000000);
        },
        unlocked() { return (player.storylayer.storycounter==7&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',23)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);showTab('none');},
        },
        24:{ title: "Comm-Channel",
        fullDisplay(){
            return "<b>Comm-Channel</b><br>Gain 10 World Steps in a bulk.<br><br>Req:Unlock Both G&K layers"
        },
        canAfford(){return player.storylayer.storycounter==8&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.etoluna.unlocked&&player.saya.unlocked},
        pay(){
        },
        unlocked() { return (player.storylayer.storycounter==8&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',24)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        effect(){
            let eff = new Decimal(1);
            if (hasUpgrade('storylayer',24)) eff = new Decimal(10);
            return eff;
        }
        },
        25:{ title: "Spiritual Bounds",
        fullDisplay(){
            return "<b>Spiritual Bounds</b><br>Star Points&Moon Points gain is boosted when fallen behind by another.<br><br>Req:1,500 on both Star Points&Moon Points"
        },
        canAfford(){return player.storylayer.storycounter==9&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.etoluna.starPoint.gte(1500)&&player.etoluna.moonPoint.gte(1500)},
        pay(){
        },
        unlocked() { return (player.storylayer.storycounter==9&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',25)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        31:{ title: "Fragmented Fusion",
        fullDisplay(){
            return "<b>Fragmented Fusion</b><br>World Step Height softcap exponent ^3 → ^2.<br><br>Req:35 Everflashing Knives"
        },
        canAfford(){return player.storylayer.storycounter==10&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.saya.points.gte(35)},
        pay(){
        },
        unlocked() { return (player.storylayer.storycounter==10&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',31)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        32:{ title: "Unrecorded History",
        fullDisplay(){
            return "<b>Unrecorded History</b><br>Star Points&Moon Points boosts Luminous Churches&Flourish Labyrinths gain.<br><br>Req:40 Gemini Bounds"
        },
        effect(){
            let eff = player.etoluna.starPoint.plus(player.etoluna.moonPoint).plus(1).log(7.5).sqrt();
            return eff;
        },
        canAfford(){return player.storylayer.storycounter==11&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.etoluna.points.gte(40)},
        pay(){
        },
        unlocked() { return (player.storylayer.storycounter==11&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',32)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        33:{ title: "Rediscover Fragments",
        fullDisplay(){
            return "<b>Rediscover Fragments</b><br>Unlock Fragmental researches.<br><br>Cost:400,000,000 Research Points"
        },
        canAfford(){return player.storylayer.storycounter==12&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.lab.points.gte(400000000)},
        pay(){
            player.lab.points = player.lab.points.sub(400000000);
        },
        unlocked() { return (player.storylayer.storycounter==12&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',33)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
    }
})
