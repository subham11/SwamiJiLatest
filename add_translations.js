const fs = require('fs');
const path = require('path');

// Add English pitrShanti translations
const enFilePath = path.join(__dirname, 'src/locales/en/common.json');
const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));

enData.pitrShanti = {
  title: "Pitr Shanti Poojan – Bringing Peace to Ancestral Souls",
  subtitle: "Ritual for Pacifying and Liberating All Ancestral Spirits",
  introTitle: "Understanding Pitr Shanti Poojan",
  paragraph1: "Pitr Shanti Poojan is a sacred Vedic ritual performed to pacify, satisfy, and bring relief to all ancestral souls – not limited to a specific lineage or generation. Unlike Shraddh which is performed on specific dates or Tripindi which focuses on three generations, Pitr Shanti is a universal ceremony to address the dissatisfaction of any and all deceased ancestors whose presence may be causing problems or disturbances in the family.",
  paragraph2: "This powerful ritual is based on the principle that unsatisfied or angry ancestors (Pitri Dosha) can negatively influence their descendants' lives in various ways. When ancestral debts remain unpaid or when proper rituals are neglected, the spirits may cause obstacles in marriage, career, health, finances, relationships, and overall prosperity of the family.",
  whyTitle: "Why Perform Pitr Shanti Poojan?",
  paragraph3: "According to the Garuda Purana and other Hindu scriptures, the souls of deceased family members who are not properly honored through rituals remain in a state of dissatisfaction. They may linger in the earthly realm, unable to progress to their rightful destination. In their frustration, they may interfere with the lives of their descendants, creating obstacles and suffering.",
  paragraph4: "Pitr Shanti Poojan addresses these issues by performing comprehensive rituals including sacred invocations (Mantras), offerings of water (Tarpan), food offerings (Bali), and fire ceremonies (Havan). The ritual seeks to fulfill the unfulfilled wishes of the ancestors and grant them peace, thereby liberating both the souls of the ancestors and their descendants from the burden of unresolved ancestral karma.",
  benefitsTitle: "Key Benefits of Pitr Shanti Poojan",
  benefits: {
    item1: "Peace and satisfaction for all ancestral spirits, regardless of generation",
    item2: "Removal of Pitri Dosha and its negative effects on the family",
    item3: "Resolution of recurring obstacles in career, education, and professional growth",
    item4: "Improvement in relationships and family harmony",
    item5: "Relief from chronic health issues and psychological disturbances",
    item6: "Blessing and prosperity for the entire family lineage"
  },
  stepsTitle: "Steps of the Pitr Shanti Ritual",
  steps: {
    step1: { title: "Purification and Sacred Preparation", desc: "The ritual space is sanctified, and participants undergo purification to prepare for the sacred ceremony." },
    step2: { title: "Invocation (Pranidhan)", desc: "All ancestors, both known and unknown, are respectfully invoked with sacred mantras to invite their spiritual presence." },
    step3: { title: "Water Offerings (Tarpan)", desc: "Offerings of water mixed with sesame seeds and sacred herbs are made to satisfy the thirst and desires of the ancestral souls." },
    step4: { title: "Food and Flower Offerings (Bali)", desc: "Symbolic food offerings and flowers are presented with mantras to gratify the ancestors spiritually." },
    step5: { title: "Fire Ceremony (Havan)", desc: "Sacred fire is offered with ghee, grains, and herbs while reciting Vedic mantras to purify and liberate the ancestral spirits." },
    step6: { title: "Brahmin Feeding and Blessings", desc: "Brahmins are fed and asked to bless the family, sealing the ritual with their divine blessings for peace and prosperity." }
  },
  cards: {
    meaning: { title: "What is Pitr Shanti", desc: "A universal Vedic ceremony to pacify, satisfy, and liberate all ancestral souls and resolve ancestral karmic debts affecting the family." },
    when: { title: "When to Perform", desc: "After Pitri Dosha is detected in a horoscope, during inauspicious periods, or as recommended by a qualified priest after consultation." },
    who: { title: "Who Should Perform", desc: "The eldest son traditionally performs it; in absence, daughters, grandsons, or close family members can conduct the ritual with proper guidance." },
    vidhi: { title: "Ritual Duration", desc: "Typically 3-5 hours depending on the complexity. The ritual should be performed on auspicious days and at proper Muhurat (time)." }
  },
  ctaTitle: "Bring Peace to Your Ancestral Lineage",
  ctaDesc: "Let us help you perform this sacred ritual with proper Vedic procedures and genuine devotion. Contact our Ashram coordination team to schedule your Pitr Shanti Poojan ceremony.",
  ctaButton: "Schedule Your Ritual"
};

fs.writeFileSync(enFilePath, JSON.stringify(enData, null, 2));
console.log("✓ English pitrShanti translations added");

// Add Hindi pitrShanti translations
const hiFilePath = path.join(__dirname, 'src/locales/hi/common.json');
const hiData = JSON.parse(fs.readFileSync(hiFilePath, 'utf-8'));

hiData.pitrShanti = {
  title: "पितृ शांति पूजन – पूर्वजों की आत्माओं को शांति प्रदान करना",
  subtitle: "सभी पूर्वजों की आत्माओं को शांत और मुक्त करने का अनुष्ठान",
  introTitle: "पितृ शांति पूजन को समझना",
  paragraph1: "पितृ शांति पूजन एक पवित्र वैदिक अनुष्ठान है जो सभी पूर्वजों की आत्माओं को शांत, संतुष्ट और राहत देने के लिए किया जाता है – यह किसी विशेष पीढ़ी या वंश तक सीमित नहीं है।",
  paragraph2: "यह शक्तिशाली अनुष्ठान इस सिद्धांत पर आधारित है कि असंतुष्ट या क्रुद्ध पूर्वज (पितृ दोष) अपने वंशजों के जीवन को विभिन्न तरीकों से नकारात्मक रूप से प्रभावित कर सकते हैं।",
  whyTitle: "पितृ शांति पूजन क्यों करें?",
  paragraph3: "गरुड़ पुराण और अन्य हिंदू शास्त्रों के अनुसार, दिवंगत परिवार के सदस्यों की आत्माएं जिन्हें अनुष्ठानों के माध्यम से सही तरीके से सम्मानित नहीं किया गया है, वे असंतुष्टि की स्थिति में रहती हैं।",
  paragraph4: "पितृ शांति पूजन इन समस्याओं को पवित्र आह्वान (मंत्र), जल अर्पण (तर्पण), खाद्य अर्पण (बलि) और अग्नि समारोहों (होम) सहित व्यापक अनुष्ठान करके संबोधित करता है।",
  benefitsTitle: "पितृ शांति पूजन के मुख्य लाभ",
  benefits: {
    item1: "सभी पूर्वजों की आत्माओं को शांति और संतुष्टि, चाहे कोई भी पीढ़ी हो",
    item2: "पितृ दोष और परिवार पर उसके नकारात्मक प्रभावों को दूर करना",
    item3: "करियर, शिक्षा और व्यावसायिक वृद्धि में बार-बार आने वाली बाधाओं का समाधान",
    item4: "रिश्तों और पारिवारिक सामंजस्य में सुधार",
    item5: "पुरानी स्वास्थ्य समस्याओं और मनोवैज्ञानिक परेशानियों से राहत",
    item6: "संपूर्ण पारिवारिक वंश को आशीर्वाद और समृद्धि"
  },
  stepsTitle: "पितृ शांति अनुष्ठान के चरण",
  steps: {
    step1: { title: "पवित्रता और पवित्र तैयारी", desc: "अनुष्ठान स्थान को पवित्र किया जाता है।" },
    step2: { title: "आह्वान (प्राणिधान)", desc: "सभी पूर्वजों को पवित्र मंत्रों के साथ आमंत्रित किया जाता है।" },
    step3: { title: "जल अर्पण (तर्पण)", desc: "तिल और पवित्र जड़ी-बूटियों के मिश्रण से बने जल का अर्पण किया जाता है।" },
    step4: { title: "खाद्य और फूलों का अर्पण (बलि)", desc: "प्रतीकात्मक खाद्य और फूलों का अर्पण किया जाता है।" },
    step5: { title: "अग्नि समारोह (होम)", desc: "वैदिक मंत्रों का जाप करते हुए पवित्र अग्नि में आहुति दी जाती है।" },
    step6: { title: "ब्राह्मण भोजन और आशीर्वाद", desc: "ब्राह्मणों को भोजन कराया जाता है और उनका आशीर्वाद लिया जाता है।" }
  },
  cards: {
    meaning: { title: "पितृ शांति क्या है", desc: "सभी पूर्वजों की आत्माओं को शांत करने और परिवार को प्रभावित करने वाले पारिवारिक कर्मों को हल करने का एक समारोह।" },
    when: { title: "कब करें", desc: "जब कुंडली में पितृ दोष पाया जाए, या योग्य पुरोहित की सिफारिश के बाद।" },
    who: { title: "कौन करे", desc: "सबसे बड़ा पुत्र परंपरागत रूप से करता है; अनुपस्थिति में परिवार के सदस्य कर सकते हैं।" },
    vidhi: { title: "अनुष्ठान की अवधि", desc: "जटिलता के आधार पर आमतौर पर 3-5 घंटे।" }
  },
  ctaTitle: "अपने पूर्वजों के वंश को शांति दें",
  ctaDesc: "इस पवित्र अनुष्ठान को सही तरीके से करने के लिए हमसे संपर्क करें।",
  ctaButton: "अपने अनुष्ठान को शेड्यूल करें"
};

fs.writeFileSync(hiFilePath, JSON.stringify(hiData, null, 2));
console.log("✓ Hindi pitrShanti translations added");
