# User Personas & Target Audience

This document defines the key user roles within the Momento ecosystem through detailed personas, helping guide product development and user experience design.

## Table of Contents

- [Overview](#overview)
- [1. The Participant: "Alex, the Newcomer"](#1-the-participant-alex-the-newcomer)
- [2. The User Host: "David, the Curator"](#2-the-user-host-david-the-curator)
- [3. The Community Host: "The Juniper Cafe"](#3-the-community-host-the-juniper-cafe)
- [Persona Relationships](#persona-relationships)
- [Design Implications](#design-implications)

---

## Overview

The Momento ecosystem is comprised of three key roles. An individual account can potentially hold multiple roles, creating a dynamic and interconnected community. These personas guide our product development and ensure we're building features that serve real user needs.

### Key Roles

1. **Participant** - Core users attending events and seeking connections
2. **User Host** - Individual users creating and hosting unique experiences
3. **Community Host** - Local businesses using Momento to build community and drive traffic

---

## 1. The Participant: "Alex, the Newcomer"

### Basic Information

- **Role:** `Participant`
- **Age:** 28 years old
- **Occupation:** Graphic Designer
- **Location:** Recently moved to a new city (6 months ago)
- **Personality:** Introverted but eager to connect, thoughtful, creative

### Background Story

Alex moved to a new city six months ago for a job opportunity. While she loves her work as a graphic designer, she's found it challenging to meet like-minded people outside of her professional circle. She's naturally introverted but deeply desires to find a small, core group of friends who share her interests in art, indie films, and urban exploration.

### Goals & Motivations

#### Primary Goals

- **Genuine Connections**: Find authentic relationships with like-minded people in a low-pressure setting
- **Discovery**: Explore interesting, off-the-beaten-path activities in her new city
- **Safety**: Feel secure and comfortable in social settings with strangers
- **Memory Building**: Create a meaningful "memory book" of people and experiences

#### Secondary Goals

- **Dating**: Open to romantic connections but prefers organic development over high-pressure dating apps
- **Community**: Build a sense of belonging in her new city
- **Personal Growth**: Step outside her comfort zone in a supportive environment

### Pain Points & Frustrations

#### Dating App Fatigue

- **Problem**: Exhausted by endless swiping, superficial conversations, and ghosting
- **Impact**: Feels pressure to be "on" all the time, leading to burnout
- **Current Solutions**: Has tried multiple dating apps but finds them unsatisfying

#### Logistical Challenges

- **Problem**: Difficulty organizing group outings and coordinating schedules
- **Impact**: Often ends up doing activities alone or missing out entirely
- **Current Solutions**: Relies on work colleagues for social activities

#### Social Anxiety

- **Problem**: Dislikes the initial awkwardness of finding groups at crowded venues
- **Impact**: Hesitates to attend social events due to arrival anxiety
- **Current Solutions**: Prefers smaller, more intimate gatherings

#### Superficial Interactions

- **Problem**: Finds most social mixers are loud and don't facilitate deep conversations
- **Impact**: Leaves events feeling unfulfilled and disconnected
- **Current Solutions**: Seeks out more niche, interest-based activities

### How Momento Serves Alex

#### Curated Experience

- **Solution**: Momento does the planning for her, inviting her to events based on deep interest analysis
- **Benefit**: Removes the burden of event discovery and coordination
- **Implementation**: AI-powered matching algorithm considers her interests, location, and preferences

#### Low-Pressure Environment

- **Solution**: Small group settings focused on shared activities
- **Benefit**: Removes the pressure of one-on-one dating while facilitating natural connections
- **Implementation**: 6-12 person events with structured activities

#### Seamless Arrival Experience

- **Solution**: "Signal" arrival system with clear group identification
- **Benefit**: Eliminates arrival anxiety with confident, clear connection points
- **Implementation**: `arrival_signpost` and `DeckOfCardsAttendee` features

#### Post-Event Connection

- **Solution**: Memory Book and private messaging for continued communication
- **Benefit**: Allows relationships to develop naturally after initial comfort is established
- **Implementation**: `MemoryBookTab` with private notes and messaging

#### Safety & Trust

- **Solution**: Mandatory host verification and comprehensive safety tools
- **Benefit**: Creates secure environment for meeting new people
- **Implementation**: Stripe Identity verification, user reporting, blocking features

### Behavioral Patterns

#### Technology Usage

- **Primary Device**: iPhone (iOS user)
- **App Preferences**: Values intuitive, beautiful interfaces
- **Social Media**: Moderate user, prefers visual platforms like Instagram
- **Communication**: Prefers text-based communication initially

#### Decision Making

- **Research Style**: Thorough, reads reviews and details carefully
- **Risk Tolerance**: Conservative, needs reassurance before trying new things
- **Social Approach**: Observes before participating, builds comfort gradually

#### Lifestyle Patterns

- **Schedule**: Regular work hours, available evenings and weekends
- **Budget**: Moderate, willing to spend on quality experiences
- **Location**: Prefers events within 10-15 miles of home
- **Frequency**: 1-2 events per month initially, increasing as comfort grows

---

## 2. The User Host: "David, the Curator"

### Basic Information

- **Role:** `User Host`
- **Age:** 34 years old
- **Occupation:** High School History Teacher
- **Location:** Urban area with rich historical context
- **Personality:** Passionate, community-oriented, detail-oriented, generous

### Background Story

David is a dedicated high school history teacher who finds immense joy in creating unique experiences and bringing people together. Whether it's leading historical walking tours of his neighborhood, organizing themed potlucks, or hosting weekend board game tournaments, he thrives on the energy of shared experiences. His passion extends beyond teaching to creating memorable moments that foster genuine connections.

### Goals & Motivations

#### Primary Goals

- **Share Passion**: Connect people with his knowledge and enthusiasm for history, games, and community
- **Build Community**: Create spaces where people can form meaningful relationships
- **Recognition**: Build a reputation as a great host and receive positive feedback
- **Personal Connection**: Meet new people who appreciate his efforts and share his interests

#### Secondary Goals

- **Skill Development**: Improve his event planning and hosting abilities
- **Networking**: Expand his social circle through hosting
- **Legacy**: Create memorable experiences that people talk about and remember

### Pain Points & Frustrations

#### Commitment Issues

- **Problem**: Friends frequently bail on plans he's spent hours organizing
- **Impact**: Discouraged from planning complex events, feels his time is wasted
- **Current Solutions**: Tries to over-invite to account for no-shows

#### Financial Awkwardness

- **Problem**: Uncomfortable chasing people for money for tickets or shared costs
- **Impact**: Often ends up covering costs himself or avoiding events with expenses
- **Current Solutions**: Prefers free events or absorbs costs personally

#### Tool Limitations

- **Problem**: Using multiple platforms (group chats, calendar invites, spreadsheets) is inefficient
- **Impact**: Spends more time on logistics than creative planning
- **Current Solutions**: Accepts inefficiency as necessary for hosting

#### Audience Building

- **Problem**: Difficulty finding people interested in his specific events
- **Impact**: Events often have low attendance despite quality planning
- **Current Solutions**: Relies on existing social networks

### How Momento Serves David

#### Committed Audience

- **Solution**: $5 confirmation fee ensures attendees are invested
- **Benefit**: Reduces no-shows and creates more reliable events
- **Implementation**: Payment processing integrated into invitation flow

#### Powerful Planning Tools

- **Solution**: Comprehensive event creation flow with multi-stop itineraries
- **Benefit**: All planning tools in one place, from concept to execution
- **Implementation**: `CreateEventFlow` with maps, times, and descriptions

#### Automated Logistics

- **Solution**: App handles invitations, reminders, and calendar integration
- **Benefit**: Focus on creative aspects rather than administrative tasks
- **Implementation**: Automated notification system and calendar sync

#### Reputation Building

- **Solution**: Public host profile with ratings and reviews
- **Benefit**: Showcase success and attract people to future events
- **Implementation**: `Host Profile` with aggregated feedback

#### Dual Participation

- **Solution**: Option to participate in own events as attendee
- **Benefit**: Don't have to choose between organizing and connecting
- **Implementation**: "Host as Attendee" checkbox in event creation

### Behavioral Patterns

#### Planning Style

- **Detail Orientation**: Loves creating comprehensive, well-thought-out experiences
- **Research Approach**: Thorough background research and preparation
- **Flexibility**: Adapts plans based on group dynamics and feedback
- **Innovation**: Constantly looking for new ways to enhance experiences

#### Communication Preferences

- **Style**: Warm, enthusiastic, and informative
- **Frequency**: Regular updates and clear communication
- **Channels**: Prefers in-app messaging for event coordination
- **Tone**: Encouraging and inclusive

#### Event Philosophy

- **Size**: Prefers intimate groups (6-12 people)
- **Duration**: 2-4 hour events with clear structure
- **Location**: Mix of indoor and outdoor venues
- **Cost**: Keeps costs low, focuses on experience over luxury

---

## 3. The Community Host: "The Juniper Cafe"

### Basic Information

- **Role:** `Community Host`
- **Type:** Local Independent Coffee Shop
- **Location:** Urban neighborhood with foot traffic
- **Size:** Small to medium business (10-20 employees)
- **Values:** Community, quality, sustainability, local connection

### Background Story

The Juniper Cafe is a beloved local coffee shop with a beautiful, well-designed space and a passion for building community. They serve high-quality coffee and food, but struggle with inconsistent foot traffic, especially during weeknights and off-peak hours. The owners want to find creative ways to bring new customers through their doors while staying true to their community-focused mission.

### Goals & Motivations

#### Primary Goals

- **Increase Revenue**: Boost foot traffic and sales during slow periods
- **Build Loyalty**: Create a base of regular, local customers
- **Community Hub**: Become known as a gathering place, not just a coffee shop
- **Brand Awareness**: Market their space and products to new audiences

#### Secondary Goals

- **Staff Development**: Provide opportunities for staff to engage with community
- **Local Partnerships**: Collaborate with other local businesses and artists
- **Sustainability**: Maintain profitability while supporting local economy

### Pain Points & Frustrations

#### Marketing Ineffectiveness

- **Problem**: Traditional marketing (social media ads, flyers) has low ROI
- **Impact**: High marketing spend with minimal return in regular customers
- **Current Solutions**: Rely on word-of-mouth and location-based foot traffic

#### Event Management Complexity

- **Problem**: Lack of staff and expertise to manage ticketing, promotion, and communication
- **Impact**: Avoid hosting events despite having ideal space
- **Current Solutions**: Occasional partnerships with local organizations

#### Customer Acquisition Cost

- **Problem**: High cost to acquire new customers through traditional advertising
- **Impact**: Limited marketing budget restricts growth opportunities
- **Current Solutions**: Focus on existing customer retention

#### Space Utilization

- **Problem**: Beautiful space underutilized during off-peak hours
- **Impact**: Fixed costs without corresponding revenue
- **Current Solutions**: Accept lower utilization as cost of business

### How Momento Serves The Juniper Cafe

#### Targeted Audience

- **Solution**: Pre-vetted, local individuals actively seeking new experiences
- **Benefit**: Higher quality leads than traditional advertising
- **Implementation**: Location-based matching with interest alignment

#### Zero Upfront Cost

- **Solution**: No cost to host events, revenue from attendees
- **Benefit**: Risk-free way to attract new customers
- **Implementation**: Revenue sharing model with event fees

#### Turnkey Solution

- **Solution**: Momento handles all logistics and coordination
- **Benefit**: Focus on providing great experience, not event management
- **Implementation**: Complete event management platform

#### Brand Building

- **Solution**: Public host profile with ratings and reviews
- **Benefit**: Build reputation as community hub and generate word-of-mouth
- **Implementation**: `Host Profile` with aggregated feedback and testimonials

#### Community Integration

- **Solution**: Regular events create ongoing community presence
- **Benefit**: Become known as local gathering place
- **Implementation**: Recurring event opportunities and community features

### Behavioral Patterns

#### Business Approach

- **Customer Service**: High priority on guest experience and satisfaction
- **Quality Focus**: Emphasis on product quality and atmosphere
- **Community Minded**: Values local connections and community impact
- **Adaptability**: Willing to try new approaches to meet customer needs

#### Event Preferences

- **Types**: Educational (coffee tastings, latte art), social (book clubs, game nights), cultural (local artist showcases)
- **Frequency**: 2-4 events per month
- **Duration**: 1-3 hours, typically evening events
- **Capacity**: 10-25 people depending on event type

#### Communication Style

- **Tone**: Warm, welcoming, and professional
- **Frequency**: Regular updates and clear information
- **Channels**: Prefer in-app communication for event coordination
- **Content**: Focus on experience and community building

---

## Persona Relationships

### Interaction Patterns

#### Participant ↔ User Host

- **Primary Relationship**: Event attendance and shared experiences
- **Communication**: Pre-event coordination, post-event feedback
- **Trust Building**: Through successful events and positive interactions
- **Long-term**: Potential for friendship and repeat attendance

#### Participant ↔ Community Host

- **Primary Relationship**: Customer-business relationship enhanced by events
- **Communication**: Event-specific coordination, general customer service
- **Trust Building**: Through quality experiences and consistent service
- **Long-term**: Customer loyalty and regular patronage

#### User Host ↔ Community Host

- **Primary Relationship**: Venue partnerships and collaborative events
- **Communication**: Venue booking, event planning, logistics coordination
- **Trust Building**: Through successful collaborations and mutual benefit
- **Long-term**: Ongoing partnerships and co-hosted events

### Hybrid Users

#### Participant + User Host

- **Profile**: "David" who also attends events as a participant
- **Benefits**: Understands both perspectives, can create better events
- **Challenges**: Balancing hosting responsibilities with personal enjoyment
- **Implementation**: Mode switching between social and host interfaces

#### Participant + Community Host

- **Profile**: Business owner who also participates in community events
- **Benefits**: Deeper understanding of customer needs and community dynamics
- **Challenges**: Managing business and personal social interactions
- **Implementation**: Separate profiles for business and personal use

---

## Design Implications

### User Interface Considerations

#### For Participants (Alex)

- **Onboarding**: Gentle, reassuring introduction to platform
- **Discovery**: Clear, appealing event presentation with safety indicators
- **Communication**: Multiple ways to connect with varying comfort levels
- **Safety**: Prominent safety features and trust indicators

#### For User Hosts (David)

- **Event Creation**: Comprehensive but intuitive planning tools
- **Management**: Clear overview of event status and attendee information
- **Feedback**: Easy access to ratings and improvement suggestions
- **Flexibility**: Tools to adapt events based on attendee feedback

#### For Community Hosts (Juniper Cafe)

- **Business Tools**: Professional dashboard with business metrics
- **Event Management**: Streamlined tools for regular event hosting
- **Customer Insights**: Data on attendee demographics and preferences
- **Branding**: Opportunities to showcase business identity and values

### Feature Priorities

#### High Priority (All Personas)

- **Safety & Trust**: Verification, reporting, blocking features
- **Communication**: In-app messaging and coordination tools
- **Discovery**: Effective matching and event discovery
- **Payment**: Seamless payment processing and refund handling

#### Medium Priority

- **Analytics**: Host insights and participant feedback
- **Social Features**: Memory book, kudos, social sharing
- **Customization**: Profile personalization and event customization
- **Integration**: Calendar sync, social media integration

#### Lower Priority

- **Advanced Features**: AI recommendations, advanced analytics
- **Community Tools**: Group formation, recurring events
- **Business Features**: Advanced business insights and tools
- **Platform Expansion**: Web interface, API access

### Success Metrics

#### Participant Success

- **Engagement**: Event attendance rate, app usage frequency
- **Satisfaction**: Event ratings, kudos received, retention rate
- **Connection**: New connections made, repeat interactions
- **Safety**: Incident reports, trust in platform

#### Host Success

- **Event Quality**: Average ratings, attendee satisfaction
- **Efficiency**: Time spent planning, automation usage
- **Growth**: Repeat hosting, expanding event types
- **Community**: Attendee feedback, word-of-mouth referrals

#### Platform Success

- **Growth**: User acquisition, retention, engagement
- **Quality**: Event success rate, user satisfaction
- **Safety**: Incident rate, trust and safety metrics
- **Business**: Revenue, host satisfaction, community health

---

**Last Updated:** 2024-12-19
