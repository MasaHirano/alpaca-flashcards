import Phrase from './models/Phrase';
import Tag from './models/Tag';

const Realm = require('realm');
const realm = new Realm({ schema: [Phrase, Tag], schemaVersion: 1 });

export default class Importter {
  constructor() {
  }

  import() {
    var rows = this.fetchData();
    for (let row of rows) {
      realm.write(() => {
        var tag = realm.objects('Tag').filtered('name = $0', row['tag'])[0];
        if (!tag) {
          var maxTagId = realm.objects('Tag').max('id');
          tag = realm.create('Tag', {
            id: isNaN(maxTagId) ? 1 : ++maxTagId,
            name: row['tag'],
          })
        }
        var maxPhraseId = realm.objects('Phrase').max('id');
        const phrase = realm.create('Phrase', {
          id: isNaN(maxPhraseId) ? 1 : ++maxPhraseId,
          sentence: row['sentence'],
          tags: [].concat(tag),
        });
      });
    }
  }

  fetchData() {
    const data = [
      ["Don't you dare", "BigBangTheory_S02E16"],
      ["There's kind of an obvious solution here", "BigBangTheory_S02E16"],
      ["Can't you be a little bit flexible?", "BigBangTheory_S02E16"],
      ["What am I supposed to do?", "BigBangTheory_S02E17"],
      ["Nevertheless, I must depart", "BigBangTheory_S02E17"],
      ["I highly doubt it.", "BigBangTheory_S02E17"],
      ["Just give it a try.", "BigBangTheory_S02E17"],
      ["You did make that up right? - Oh, God, I wish I had.", "BigBangTheory_S02E17"],
      ["I thought you ware involved in some sort of socially intimate pairing with Leslie Wincle.", "BigBangTheory_S02E17"],
      ["Let me explain to how this works.", "BigBangTheory_S02E17"],
      ["Hang on a sec.", "BigBangTheory_S02E17"],
      ["Fair enough. But then let me move on to number two.", "BigBangTheory_S02E17"],
      ["secret agent laser obstacle chess", "BigBangTheory_S02E18"],
      ["Despite my deep love of chess, I must forfeit.", "BigBangTheory_S02E18"],
      ["Could you maybe show me how to make more money with this?", "BigBangTheory_S02E18"],
      ["Who's up for Sheldon-Free Saturday?", "BigBangTheory_S02E20"],
      ["Do you have a moment?", "BigBangTheory_S02E20"],
      ["That's really cool of you.", "BigBangTheory_S02E22"],
      ["Do you mind giving me some advice?", "BigBangTheory_S02E22"],
      ["Have you notified NASA?", "BigBangTheory_S02E22"],
      ["How'd it go with Stuart last night?", "BigBangTheory_S02E22"],
      ["you may be right", "BigBangTheory_S03E01"],
      ["I should've gone over and told her we were back", "BigBangTheory_S03E01"],
      ["The whole plan reeks of Leonard", "BigBangTheory_S03E01"],
      ["I guess it kind of is our fault", "BigBangTheory_S03E01"],
      ["You watch your mouth, Shelly.", "BigBangTheory_S03E01"],
      ["You don't have to, but it's highly recommended", "BigBangTheory_S03E02"],
      ["So you've been through this before?", "BigBangTheory_S03E02"],
      ["They're gonna get beaten up at thant club.", "BigBangTheory_S03E03"],
      ["I think we're fitting in quite nicely.", "BigBangTheory_S03E03"],
      ["Can you pass the Chex Mix, please?", "BigBangTheory_S03E03"],
      ["Do either of you ladies enjoy the novels of John Grisham?", "BigBangTheory_S03E03"],
      ["I wonder if anyone else has stumbled onto that", "BigBangTheory_S03E03"],
      ["Penny has upgraded his designated term of endearment", "BigBangTheory_S03E04"],
      ["You guess? You don't seem to have much of a handle on this.", "BigBangTheory_S03E04"],
      ["here's the deal", "BigBangTheory_S03E04"],
      ["my research ran into a dead end", "BigBangTheory_S03E04"],
      ["I was going to say sad. I don't know why I hedged.", "BigBangTheory_S03E04"],
      ["Are you saying that he discriminated against you? We should file a complaint.", "BigBangTheory_S03E04"],
      ["Those are very cogent and reasonable conditions. - I reject them all.", "BigBangTheory_S03E04"],
      ["Don't talk to me like an idiot.", "BigBangTheory_S03E07"],
      ["Look on the bright side.", "BigBangTheory_S03E07"],
      ["Just give us a minute? Take all the time you need.", "BigBangTheory_S03E07"],
      ["It will help take your mind off things.", "BigBangTheory_S03E07"],
      ["Do you think it's okay to have an ex-boyfriend sleep on her couch? - No, she's obviously way out of line.", "BigBangTheory_S03E07"],
      ["I assume that hence my true purpose in coming here. - Which is?", "BigBangTheory_S03E07"],
      ["I want you to crawl back to him and apologize.", "BigBangTheory_S03E07"],
      ["Is that what you want? - Of course not. I'll have my usual.", "BigBangTheory_S03E07"],
      ["I need you to do me a favor.", "BigBangTheory_S03E07"],
      ["Right now would be good. A few minutes ago would've been better.", "BigBangTheory_S03E07"],
      ["Why would you tell her something like that? - It doesn't matter why he told me.", "BigBangTheory_S03E07"],
      ["That is completely below the belt.", "BigBangTheory_S03E07"],
      ["Eyes on the road!", "BigBangTheory_S03E07"],
      ["Leonard and I are in a relationship and occasionally we're gonna fight.", "BigBangTheory_S03E07"],
      ["But no mater what happens between us, we will always love you.", "BigBangTheory_S03E07"],
      ["Could it be?", "BigBangTheory_S03E08"],
      ["I'm interested in what's inside people too. But why is it wrong to want those insides wrapped up.", "BigBangTheory_S03E09"],
      ["He got you, you can get him back.", "BigBangTheory_S03E09"],
      ["I refuse to snk to his level", "BigBangTheory_S03E09"],
      ["What if you could make Kripke lok even sillier than he made you look?", "BigBangTheory_S03E09"],
      ["It was just a crazy idea that came to me in my tub.", "BigBangTheory_S03E09"],
      ["The more, the merrier.", "BigBangTheory_S03E10"],
      ["Don't take him too seriously. A lot of what he says is intended as humor.", "BigBangTheory_S03E10"],
      ["He just lights up when I laugh", "BigBangTheory_S03E10"],
      ["Can't you surprise him in some other way?", "BigBangTheory_S03E10"],
      ["I'm sure he'd be delightfully taken aback if you clean your apartment", "BigBangTheory_S03E10"],
      ["I'd love to see that. You're welcome to come.", "BigBangTheory_S03E10"],
      ["Look, let's not get off topic.", "BigBangTheory_S03E10"],
      ["That was amazing how you handled him.", "BigBangTheory_S03E14"],
      ["I know how to deal with stubborn children.", "BigBangTheory_S03E14"],
      ["it creeps me out", "BigBangTheory_S03E14"],
      ["If you don't come out of there, I'm gonna have to drag you out.", "BigBangTheory_S03E14"],
      ["I'm gonna need a little more.", "BigBangTheory_S03E14"],
      ["thanks for sharing with us", "BigBangTheory_S03E14"],
      ["I don't get it. - Still don't get it.", "BigBangTheory_S03E15"],
      ["Keep thinking that.", "BigBangTheory_S03E15"],
      ["it's still no reason to have your feet in my spot", "BigBangTheory_S04E05"],
      ["that didn't even crack my top 10", "BigBangTheory_S04E05"],
      ["I find myself wondering", "BigBangTheory_S04E05"],
      ["I just love that line, even the way you do it.", "BigBangTheory_S04E14"],
      ["Put emotion to it.", "BigBangTheory_S04E14"],
      ["You're being silly", "BigBangTheory_S04E22"],
      ["I'm not concerned about who hangs out with who", "BigBangTheory_S04E22"],
      ["I'm not a very good liar", "BigBangTheory_S04E22"],
      ["Take one for the team", "BigBangTheory_S04E22"],
      ["Have you considered massage?", "BigBangTheory_S04E24"],
      ["you let me worry about the money", "BigBangTheory_S04E24"],
      ["I just want my baby to have pretty things", "BigBangTheory_S04E24"],
      ["I've had way too much already", "BigBangTheory_S04E24"],
      ["Can we not talk about this anymore?", "BigBangTheory_S04E24"],
      ["I screwed up.", "BigBangTheory_S04E24"],
      ["I have no idea what it means, but I listen.", "BigBangTheory_S04E24"],
      ["Of course it is. It always is. It's India.", "BigBangTheory_S04E24"],
      ["It's not what it looks like.", "BigBangTheory_S04E24"],
      ["If I could, I would, but I can't, so I shan't.", "BigBangTheory_S05E01"],
      ["I screwed up everything.", "BigBangTheory_S05E01"],
      ["You're a cutie pie. Any girl would be lucky to have you.", "BigBangTheory_S05E01"],
      ["We should set him up with someone.", "BigBangTheory_S05E04"],
      ["Think she's taking advantage of him?", "BigBangTheory_S05E04"],
      ["Is everything okey?", "BigBangTheory_S05E05"],
      ["something's obviously bugging you", "BigBangTheory_S05E05"],
      ["I don't want to be the person who stands between you and your dreams", "BigBangTheory_S05E05"],
      ["Let me see if I got this right.", "BigBangTheory_S05E05"],
      ["What choice did I have?", "BigBangTheory_S05E05"],
      ["Are you a hundred percent positive you love and want to marry Howard Wolowitz?", "BigBangTheory_S05E05"],
      ["Maybe there's something there, maybe there isn't. We'll never know.", "BigBangTheory_S05E06"],
      ["it's fun to creep yourself out thinking about it", "BigBangTheory_S05E06"],
      ["How are you doing on the young lady front? I hear you're in some sort of long-distance situation.", "BigBangTheory_S05E06"],
      ["what did you think of the sushi? - The only thing that would have made it better, if it was cooked.", "BigBangTheory_S05E06"],
      ["Are you sick? - I hope so, because if this is well, life isn't worth living.", "BigBangTheory_S05E06"],
      ["We've got to get you to bed", "BigBangTheory_S05E06"],
      ["that's not who I am", "BigBangTheory_S05E07"],
      ["Then break it off with the new girl", "BigBangTheory_S05E07"],
      ["Now, let's not do anything rash.", "BigBangTheory_S05E07"],
      ["What does your gut tell you?", "BigBangTheory_S05E07"],
      ["Guys, something happened. - What's wrong?", "BigBangTheory_S05E10"],
      ["I was wondering if you'd like to get coffee sometime.", "BigBangTheory_S05E10"],
      ["It it's not going anywhere, what does it hurt to look around?", "BigBangTheory_S05E10"],
      ["For what it's worth, engaged people can look around too. Lot of options out there.", "BigBangTheory_S05E10"],
      ["You're so full of it.", "BigBangTheory_S05E10"],
      ["why don't you acknowledge you have feelings for Amy", "BigBangTheory_S05E10"],
      ["Why is everyone so obsessed with Amy and Stuart?", "BigBangTheory_S05E10"],
      ["But out of curiosity, what is a way?", "BigBangTheory_S05E10"],
      ["Do you see where I'm going with this?", "BigBangTheory_S05E10"],
      ["all I'm saying is strap on a pair and go talk to Amy", "BigBangTheory_S05E10"],
      ["You clearly don't.", "BigBangTheory_S05E11"],
      ["Leonard, I platonically love you, man. But face it, you're a mess.", "BigBangTheory_S05E11"],
      ["No one wants to hear my apologies.", "BigBangTheory_S05E11"],
      ["I just hope you can forgive me. - Sure, I guess.", "BigBangTheory_S05E11"],
      ["giving is really better than receiving", "BigBangTheory_S05E11"],
      ["They would be so cute on me", "BigBangTheory_S05E11"],
      ["Don't answer. That's a trick question. I speak from experience.", "BigBangTheory_S05E11"],
      ["I'll tell you exactly how he did.", "BigBangTheory_S05E15"],
      ["I can't stress this enough, I don't want to take you to the dentist", "BigBangTheory_S05E15"],
      ["he brought all this on himself", "BigBangTheory_S05E15"],
      ["Sometimes crazy looks like sad so it'll suck you back in", "BigBangTheory_S05E15"],
      ["we go back to the way things were", "BigBangTheory_S05E15"],
      ["I haven't seen him laugh that hard", "BigBangTheory_S05E16"],
      ["I wonder what he wants", "BigBangTheory_S05E16"],
      ["I don't need a vacation. - You're obligated to take one.", "BigBangTheory_S05E16"],
      ["Okay, it's settled, then.", "BigBangTheory_S05E16"],
      ["if I don't come into work, what am I supposed to do?", "BigBangTheory_S05E16"],
    ];

    const rowsWillInsert = data.map(r => ({ sentence: r[0], tag: r[1], }));

    return rowsWillInsert;
  }
}