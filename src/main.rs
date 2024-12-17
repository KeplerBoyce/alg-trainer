use std::collections::VecDeque;
use std::collections::HashSet;
use lse_solver::*;


fn main() {
    let state = State {
        top_back: PieceInfo::create(Piece::TopLeft),
        top_left: PieceInfo::create(Piece::TopFront),
        top_front: PieceInfo::create(Piece::BottomFront),
        top_right: PieceInfo::create(Piece::TopBack),
        bottom_back: PieceInfo::create(Piece::BottomBack),
        bottom_front: PieceInfo::create(Piece::TopRight),
        m_parity: 0,
        u_parity: 0,
    };
    print_solution(solve(state));
}

fn solve(state: State) -> Vec<Move> {
    let mut q: VecDeque<Vec<Move>> = VecDeque::new();
    let visited: HashSet<State> = HashSet::new();

    q.push_back(Vec::new());
    while let Some(curr_moves) = q.pop_front() {
        let curr_state = state.apply_all(&curr_moves);
        if curr_state.is_solved() {
            return curr_moves;
        }
        if visited.contains(&curr_state) {
            continue;
        }

        match curr_moves.last() {
            Some(Move::M) | Some(Move::Mp) | Some(Move::Mt) => {
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
            Some(Move::U) | Some(Move::Up) | Some(Move::Ut) => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
            },
            None => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
        }
    }
    return Vec::new();
}

fn print_solution(moves: Vec<Move>) {
    for m in &moves {
        match m {
            Move::M => print!("M "),
            Move::Mp => print!("M' "),
            Move::Mt => print!("M2 "),
            Move::U => print!("U "),
            Move::Up => print!("U' "),
            Move::Ut => print!("U2 "),
        }
    }
    println!();
}
