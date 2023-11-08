package src.pa1.agents;


// SYSTEM IMPORTS
import edu.cwru.sepia.action.Action;
import edu.cwru.sepia.action.ActionFeedback;
import edu.cwru.sepia.action.ActionResult;
import edu.cwru.sepia.agent.Agent;
import edu.cwru.sepia.environment.model.history.DamageLog;
import edu.cwru.sepia.environment.model.history.DeathLog;
import edu.cwru.sepia.environment.model.history.History.HistoryView;
import edu.cwru.sepia.environment.model.state.ResourceNode;
import edu.cwru.sepia.environment.model.state.ResourceNode.ResourceView;
import edu.cwru.sepia.environment.model.state.State.StateView;
import edu.cwru.sepia.environment.model.state.Unit.UnitView;
import edu.cwru.sepia.util.Direction;


import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Random;
import java.util.Set;
import java.util.Stack;


// JAVA PROJECT IMPORTS
import edu.bu.pa1.distance.DistanceMetric;
import edu.bu.pa1.graph.Vertex;
import edu.bu.pa1.graph.Path;


/*
 * 
 * 
 * MY COMMENTS START WITH "QWERTY"
 * 
 * 
 * 
 */
public class StealthAgent
    extends Agent
{

    // Fields of this class
    // TODO: add your fields here! For instance, it might be a good idea to
    // know when you've killed the enemy townhall so you know when to escape!
    // TODO: implement the state machine for following a path once we calculate it
    //       this will for sure adding your own fields.
    private Boolean deadHall;
    private Vertex home;
    private Path plan;

    private int myUnitID;
    private int enemyTownhallUnitID;
    private Set<Integer> otherEnemyUnitIDs;

    private final int enemyUnitSightRadius;

    public StealthAgent(int playerNum, String[] args)
    {
        super(playerNum);

        // set these fields to some invalid state and populate them in initialStep()
        this.myUnitID = -1;
        this.enemyTownhallUnitID = -1;
        this.otherEnemyUnitIDs = null;
        // TODO: make sure to initialize your fields (to some invalid state) here!
        this.deadHall = false;
        this.home = null;
        this.plan = null;

        int enemyUnitSightRadius = -1;
        if(args.length == 2)
        {
            try
            {
                enemyUnitSightRadius = Integer.parseInt(args[1]);

                if(enemyUnitSightRadius <= 0)
                {
                    throw new Exception("ERROR");
                }
            } catch(Exception e)
            {
                System.err.println("ERROR: [StealthAgent.StealthAgent]: error parsing second arg=" + args[1]
                    + " which should be a positive integer");
            }
        } else
        {
            System.err.println("ERROR [StealthAgent.StealthAgent]: need to provide a second arg <enemyUnitSightRadius>");
            System.exit(-1);
        }

        this.enemyUnitSightRadius = enemyUnitSightRadius;
    }

    // TODO: add some getter methods for your fields! Thats the java way to do things!
    public int getMyUnitID() { return this.myUnitID; }
    public int getEnemyTownhallUnitID() { return this.enemyTownhallUnitID; }
    public final Set<Integer> getOtherEnemyUnitIDs() { return this.otherEnemyUnitIDs; }
    public final int getEnemyUnitSightRadius() { return this.enemyUnitSightRadius; }
    public Boolean getDeadHall() { return this.deadHall; }
    public Vertex getHome() { return this.home; }
    public Path getPlan() { return this.plan; }

    // TODO: add some setter methods for your fields if they need them! Thats the java way to do things!
    private void setMyUnitID(int id) { this.myUnitID = id; }
    private void setEnemyTownhallUnitID(int id) { this.enemyTownhallUnitID = id; }
    private void setOtherEnemyUnitIDs(Set<Integer> s) { this.otherEnemyUnitIDs = s; }
    private void setDeadHall(Boolean bool) {  this.deadHall = bool; }
    private void setHome(Vertex h) { this.home = h; }
    private void setPlan(Path plan) { this.plan = plan; }




    /**
        TODO: if you add any fields to this class it might be a good idea to initialize them here
              if they need sepia information!
     */
    @Override
    public Map<Integer, Action> initialStep(StateView state,
                                            HistoryView history)
    {
        // this method is typically used to discover the units in the game.
        // any units we want to pay attention to we probably want to store in some fields

        // first find out which units are mine and which units aren't
        Set<Integer> myUnitIDs = new HashSet<Integer>();
        for(Integer unitID : state.getUnitIds(this.getPlayerNumber()))
        {
            myUnitIDs.add(unitID);
        }

        // should only be one unit controlled by me
        if(myUnitIDs.size() != 1)
        {
            System.err.println("ERROR: should only be 1 unit controlled by player=" +
                this.getPlayerNumber() + " but found " + myUnitIDs.size() + " units");
            System.exit(-1);
        } else
        {   
            int mee = myUnitIDs.iterator().next();
            this.setMyUnitID(mee); // get the one unit id

            //QWERTY this make sure we remember where we need to return to || we also set deadhall just cause we can
            UnitView me = state.getUnit(mee);
            int x = me.getXPosition();
            int y = me.getYPosition();
            this.home = new Vertex(x, y);
            this.deadHall = false;

        }


        // there can be as many other players as we want, and they can controll as many units as they want,
        // but there should be only ONE enemy townhall unit
        Set<Integer> enemyTownhallUnitIDs = new HashSet<Integer>();
        Set<Integer> otherEnemyUnitIDs = new HashSet<Integer>();
        for(Integer playerNum : state.getPlayerNumbers())
        {
            if(playerNum != this.getPlayerNumber())
            {
                for(Integer unitID : state.getUnitIds(playerNum))
                {
                    if(state.getUnit(unitID).getTemplateView().getName().toLowerCase().equals("townhall"))
                    {
                        enemyTownhallUnitIDs.add(unitID);
                    } else
                    {
                        otherEnemyUnitIDs.add(unitID);
                    }
                }
            }
        }

        // should only be one unit controlled by me
        if(enemyTownhallUnitIDs.size() != 1)
        {
            System.err.println("ERROR: should only be 1 enemy townhall unit present on the map but found "
                + enemyTownhallUnitIDs.size() + " such units");
            System.exit(-1);
        } else
        {
            this.setEnemyTownhallUnitID(enemyTownhallUnitIDs.iterator().next()); // get the one unit id
            this.setOtherEnemyUnitIDs(otherEnemyUnitIDs);
        }

        return this.middleStep(state, history);
    }

    /**
        TODO: implement me! This is the method that will be called every turn of the game.
              This method is responsible for assigning actions to all units that you control
              (which should only be a single footman in this game)
     */
    @Override
    public Map<Integer, Action> middleStep(StateView state,
                                           HistoryView history)
    {

        /**
            I would suggest implementing a state machine here to calculate a path when neccessary.
            For instance beginning with something like:

            if(this.shouldReplacePlan(state))
            {
                // recalculate the plan
            }

            then after this, worry about how you will follow this path by submitting sepia actions
            the trouble is that we don't want to move on from a point on the path until we reach it
            so be sure to take that into account in your design

            once you have this working I would worry about trying to detect when you kill the townhall
            so that you implement escaping
         */


        Map<Integer, Action> actions = new HashMap<Integer, Action>();

        UnitView myUnitView = state.getUnit(this.getMyUnitID());
        UnitView TownHallView = state.getUnit(this.getEnemyTownhallUnitID());
        Vertex myUnitCoordinate = new Vertex(myUnitView.getXPosition(), myUnitView.getYPosition());
        Vertex enemyTargetCoordinate = new Vertex(TownHallView.getXPosition(), TownHallView.getYPosition());
        
        if(this.getPlan() == null){
            Path search = search(myUnitCoordinate, this.getHome(), state);
            if (search == null){
                System.out.println("Do NOTHING");
                return actions;
            }else{
                Path newPlan = search;
                Path revPlan = new Path(newPlan.getDestination());
                newPlan = newPlan.getParentPath();
                while (newPlan != null){
                    revPlan = new Path(newPlan.getDestination(), 1f, revPlan);
                    newPlan = newPlan.getParentPath();
                }
                this.setPlan(revPlan);
            }
        }
        else if(this.shouldReplacePlan(state)){
            Path newPlan = null;
            if (TownHallView != null){
                newPlan = search(myUnitCoordinate, enemyTargetCoordinate, state);
            }else{
                newPlan = search(myUnitCoordinate, this.getHome(), state);
            } 
            
            Path revPlan = new Path(newPlan.getDestination());
            newPlan = newPlan.getParentPath();
            while (newPlan != null){
                revPlan = new Path(newPlan.getDestination(), 1f, revPlan);
                newPlan = newPlan.getParentPath();
            }
            this.setPlan(revPlan);
        }
        

        if(TownHallView != null) // still alive
        {   
	        // if we're adjacent to the townhall attack it!
	        if(DistanceMetric.chebyshevDistance(myUnitCoordinate, enemyTargetCoordinate) <= 1)
            {
                System.out.println("Attacking TownHall");
                // if no more movements in the planned path then attack
                actions.put(this.getMyUnitID(), Action.createPrimitiveAttack(this.getMyUnitID(),
                                                                             this.getEnemyTownhallUnitID()));
                
                                                                             
            } 
            else //not adjacent to townhall and townhall is still alive...try to get there
            {
                Path plan = this.getPlan();
                System.out.println("going to townhall with plan: " + plan);
                
                Direction nextDirection = this.getDirection(myUnitCoordinate, plan.getDestination());
                actions.put(this.getMyUnitID(), Action.createPrimitiveMove(this.getMyUnitID(), nextDirection));
                this.setPlan(this.getPlan().getParentPath());
            }
            	
        }else{
            if (myUnitCoordinate.equals(this.getHome())){
                System.out.println("WE DID IT!!!!");
                System.out.println("time to wait bedge");
                return actions;
            }

            Path plan = this.getPlan();
            System.out.println("going home with plan: " + plan);

            Direction nextDirection;
            if (plan.getDestination() == null){
                nextDirection = this.getDirection(myUnitCoordinate, this.getHome());
            }else{
                nextDirection = this.getDirection(myUnitCoordinate, plan.getDestination());
            }
            
            actions.put(this.getMyUnitID(), Action.createPrimitiveMove(this.getMyUnitID(), nextDirection));
            this.setPlan(this.getPlan().getParentPath());
        }

        return actions;
    }

    // Please don't mess with this
    @Override
    public void terminalStep(StateView state,
                             HistoryView history)
    {
        boolean isMyUnitDead = state.getUnit(this.getMyUnitID()) == null;
        boolean isEnemyTownhallDead = state.getUnit(this.getEnemyTownhallUnitID()) == null;

        if(isMyUnitDead)
        {
            System.out.println("mission failed");
        } else if(isEnemyTownhallDead)
        {
            System.out.println("mission success");
        } else
        {
            System.out.println("how did we get here? Both my unit and the enemy townhall are both alive?");
        }
    }

    // You probably dont need to mess with this: we dont need to save our agent
    @Override
    public void savePlayerData(OutputStream os) {}

    // You probably dont need to mess with this: we dont need to load our agent from disk
    @Override
    public void loadPlayerData(InputStream is) {}


    /**
        TODO: implement me! This method should return "true" WHEN the current plan is bad,
              and return "false" when the path is still valid. I would recommend including
              figuring out when:
                    - the path you created is not blocked by another unit on the map (that has moved)
                    - you are getting too close to an enemy unit that is NOT the townhall
                        Remember, if you get too close to the enemy units they will kill you!
                        An enemy will see you if you get within a chebyshev distance of this.getEnemyUnitSightRadius()
                        squares away
     */
    public boolean shouldReplacePlan(StateView state)
    {

        Set<Integer> enemies = getOtherEnemyUnitIDs();
        
        ArrayList<Vertex> planList = new ArrayList();
        Path plan = this.getPlan();
        while (plan != null){
            planList.add(plan.getDestination());
            plan = plan.getParentPath();
        }

        for (Vertex step : planList){
            if (step == null){
                continue;
            }
            for (Integer enemy : enemies){
                System.out.print(state.getUnit(enemy).getXPosition() + " ");
                System.out.println(state.getUnit(enemy).getYPosition());
                int r = getEnemyUnitSightRadius();
                if (state.getUnit(enemy).getXPosition()-r-1 <= step.getXCoordinate() 
                && step.getXCoordinate() <= state.getUnit(enemy).getXPosition()+r+1 
                && state.getUnit(enemy).getYPosition()-r-1 <= step.getYCoordinate() 
                && step.getYCoordinate()<= state.getUnit(enemy).getYPosition()+r+1){
                    
                    System.out.println("!!DANGER!! rerouting");
                    return true;

                }
                int x = step.getXCoordinate();
                int y = step.getYCoordinate();

                if (state.isUnitAt(x, y) && getMyUnitID() != state.unitAt(x, y)){
                    
                    System.out.println("!!DANGER!! rerouting");
                    return true;

                }
            }
    }
        System.out.println("plan still good");
        return false;
    }

    /**
        TODO: implement me! a helper function to get the outgoing neighbors of a vertex.
     */
    public Set<Vertex> getOutgoingNeighbors(Vertex src,
                                            StateView state)
    {
        Set<Vertex> outgoingNeighbors = new HashSet<Vertex>();
        return outgoingNeighbors;
    }

    public ArrayList<Vertex> neighbors(Vertex home, StateView state){
        int x = home.getXCoordinate();
        int y = home.getYCoordinate();

        ArrayList<Vertex> res = new ArrayList<Vertex>();

        Set<Integer> enemies = getOtherEnemyUnitIDs();
        HashSet<Vertex> danger = new HashSet<Vertex>();
        
        for (Integer enemy : enemies){

                int X = state.getUnit(enemy).getXPosition();
                int Y = state.getUnit(enemy).getYPosition();
                int r = getEnemyUnitSightRadius();
                for (int a = X-r-1 ; a<=X+r+1 ; a++)
                    for (int b = Y-r-1 ; b<=Y+r+1 ; b++){
                        danger.add(new Vertex(a, b));
                    }
        
            }
        

        if (state.inBounds(x+1, y+1) && !state.isResourceAt(x+1, y+1) && !danger.contains(new Vertex(x+1, y+1))) {
                res.add(new Vertex(x+1, y+1));
            }
        if (state.inBounds(x-1, y+1) && !state.isResourceAt(x-1, y+1) && !danger.contains(new Vertex(x-1, y+1))){
                res.add(new Vertex(x-1, y+1));
            }
        if (state.inBounds(x+1, y-1) && !state.isResourceAt(x+1, y-1) && !danger.contains(new Vertex(x+1, y-1))){
                res.add(new Vertex(x+1, y-1));
            }
        if (state.inBounds(x-1, y-1) && !state.isResourceAt(x-1, y-1) && !danger.contains(new Vertex(x-1, y-1))){
                res.add(new Vertex(x-1, y-1));
            }
        if (state.inBounds(x, y+1) && !state.isResourceAt(x, y+1) && !danger.contains(new Vertex(x, y+1))){
                res.add(new Vertex(x, y+1));
            }
        if (state.inBounds(x, y-1) && !state.isResourceAt(x, y-1) && !danger.contains(new Vertex(x, y-1))){
                res.add(new Vertex(x, y-1));
            }
        if (state.inBounds(x+1, y) && !state.isResourceAt(x+1, y) && !danger.contains(new Vertex(x+1, y))){
                res.add(new Vertex(x+1, y));
            }
        if (state.inBounds(x-1, y) && !state.isResourceAt(x-1, y) && !danger.contains(new Vertex(x-1, y))){
                res.add(new Vertex(x-1, y));
            }

        return res;

    }

    /**
        TODO: implement me! a helper function to get the edge weight of going from "src" to "dst"
              I would recommend discouraging your agent from getting near an enemy by producing
              really large edge costs for going to a vertex that is within the sight of an enemy
     */
    public float getEdgeWeight(StateView state,
                               Vertex src,
                               Vertex dst)
    {
        Set<Integer> enemies = getOtherEnemyUnitIDs();
        
        for (Integer enemy : enemies){
            int r = getEnemyUnitSightRadius();
            if (state.getUnit(enemy).getXPosition()-r-1 <= dst.getXCoordinate() 
            && dst.getXCoordinate() <= state.getUnit(enemy).getXPosition()+r+1 
            && state.getUnit(enemy).getYPosition()-r-1 <= dst.getYCoordinate() 
            && dst.getYCoordinate()<= state.getUnit(enemy).getYPosition()+r+1){
                return Float.MAX_VALUE;
            }
        }
        int x1 = src.getXCoordinate();
        int x2 = dst.getXCoordinate();
        int y1 = src.getYCoordinate();
        int y2 = dst.getYCoordinate();


        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    /**
        TODO: implement me! This method should implement your A* search algorithm, which is very close
              to how dijkstra's algorithm works, but instead uses an estimated total cost to the goal
              to sort rather than the known cost
     */
    public Path search(Vertex src,
                       Vertex goal,
                       StateView state)
    {
        System.out.println("searching for path...");
        Path pathToTake = new Path(src);

        PriorityQueue<Path> open = new PriorityQueue<Path>(
			new Comparator<Path>()
		{
			public int compare(Path a, Path b)
			{   
                //float aHeuristic = getEdgeWeight(state, a.getDestination(), goal);
                //float bHeuristic = getEdgeWeight(state, b.getDestination(), goal);
				return Float.compare(a.getTrueCost(), b.getTrueCost());
			}
		});
        HashSet<Vertex> closed = new HashSet();
        Map<Path, Float> path2Cost = new HashMap<Path, Float>();

        Path initPath = new Path(src);
		open.add(initPath);
        path2Cost.put(initPath, initPath.getTrueCost());
        while (open.size() != 0){
            

            Path cur = open.poll();
            closed.add(cur.getDestination());

            if (cur.getDestination().equals(goal)){
                System.out.println("Found Path!");
                return cur.getParentPath();

            }


            for (Vertex successor : neighbors(cur.getDestination(), state)){
                float childG = getEdgeWeight(state, cur.getDestination(), successor);
                if(!closed.contains(successor)){
                    
                    Path sucPath = new Path(successor, childG, cur);

                    if (!path2Cost.containsKey(sucPath)){
                        open.add(sucPath);
                        path2Cost.put(sucPath, sucPath.getTrueCost());
                    }else{
                        Float oldCost = path2Cost.get(sucPath);

                        if (sucPath.getTrueCost() < oldCost){
                            open.remove(sucPath);
                            open.add(sucPath);
                            path2Cost.replace(sucPath, sucPath.getTrueCost());
                        }
                    }
                }

            }
        }   

        return null;
    }
    
    /**
        A helper method to get the direction we will need to go in order to go from src to an adjacent
        vertex dst. Knowing this direction is necessary in order to create primitive moves in Sepia which uses
        the following factory method:
            Action.createPrimitiveMove(<unitIDToMove>, <directionToMove>);
     */
    protected Direction getDirection(Vertex src,
                                     Vertex dst)
    {
        int xDiff = dst.getXCoordinate() - src.getXCoordinate();
        int yDiff = dst.getYCoordinate() - src.getYCoordinate();

        Direction dirToGo = null;

        if(xDiff == 1 && yDiff == 1)
        {
            dirToGo = Direction.SOUTHEAST;
        }
        else if(xDiff == 1 && yDiff == 0)
        {
            dirToGo = Direction.EAST;
        }
        else if(xDiff == 1 && yDiff == -1)
        {
            dirToGo = Direction.NORTHEAST;
        }
        else if(xDiff == 0 && yDiff == 1)
        {
            dirToGo = Direction.SOUTH;
        }
        else if(xDiff == 0 && yDiff == -1)
        {
            dirToGo = Direction.NORTH;
        }
        else if(xDiff == -1 && yDiff == 1)
        {
            dirToGo = Direction.SOUTHWEST;
        }
        else if(xDiff == -1 && yDiff == 0)
        {
            dirToGo = Direction.WEST;
        }
        else if(xDiff == -1 && yDiff == -1)
        {
            dirToGo = Direction.NORTHWEST;
        } else
        {
            System.err.println("ERROR: src=" + src + " and dst=" + dst + " are not adjacent vertices");
        }

        return dirToGo;
    }

}